package com.example.eventfinder.fragments;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.location.LocationRequest;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.NavOptions;
import androidx.navigation.NavOptionsBuilder;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.eventfinder.EventObject;
import com.example.eventfinder.R;
import com.example.eventfinder.adapters.CustomAdapter;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;
import com.google.android.gms.tasks.CancellationToken;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnTokenCanceledListener;
import com.google.android.gms.tasks.Task;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;


public class EventsListFragment extends Fragment {

    private static final String TAG = "MyActivity_EventsList";

    public boolean paused = false;
    public String keyword;
    public Integer distance;
    public Integer category;
    public Boolean auto_det;
    public String location;
    public String latitude;
    public String longitude;

    public EventObject[] eventsList;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        keyword = getArguments().getString("keyword");
        distance = getArguments().getInt("distance");
        category = getArguments().getInt("category");
        auto_det = getArguments().getBoolean("auto_det");
        location = getArguments().getString("location");
        return inflater.inflate(R.layout.fragment_events_list, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        NavController navController = Navigation.findNavController(view);
        Button button = view.findViewById(R.id.back_form_button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle bundle = new Bundle();
                bundle.putString("keyword", keyword);
                bundle.putInt("distance", distance);
                bundle.putInt("category", category);
                bundle.putBoolean("auto_det", auto_det);
                bundle.putString("location", location);

                navController.navigate(R.id.action_eventsListFragment_to_searchFormFragment, bundle);
            }
        });

        getResults();
    }

    public void getResults() {
        if (auto_det) {
            getIpInfo();
        } else {
            getGeoApi();
        }
    }

    public void getIpInfo() {
        RequestQueue queue = Volley.newRequestQueue(getActivity());
        String url = "https://ipinfo.io/?token=<YOUR_TOKEN>";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    latitude = jsonObject.getString("loc").split(",")[0];
                    longitude = jsonObject.getString("loc").split(",")[1];
                    getEvents();
                } catch (JSONException e) {
                    Log.d("JSON_ERROR_IPINFO", "onResponse: "+response);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG+"_Volley_Error", "onErrorResponse: "+error.toString());
            }
        });
        queue.add(stringRequest);
    }

    public void getGeoApi() {
        RequestQueue queue = Volley.newRequestQueue(getActivity());
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key=<YOUR_TOKEN>";
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    latitude = jsonObject.getJSONArray("results").getJSONObject(0).getJSONObject("geometry").getJSONObject("location").getString("lat");
                    longitude = jsonObject.getJSONArray("results").getJSONObject(0).getJSONObject("geometry").getJSONObject("location").getString("lng");
                    getEvents();
                } catch (JSONException e) {
                    Log.d("JSON_ERROR_GEOCODING", "onResponse: "+response);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG+"_Volley_Error", "onErrorResponse: "+error.toString());
            }
        });
        queue.add(stringRequest);
    }

    public void getEvents() {
        ArrayList<String> categories = new ArrayList<String>(6);
        categories.add("");
        categories.add("KZFzniwnSyZfZ7v7nJ");
        categories.add("KZFzniwnSyZfZ7v7nE");
        categories.add("KZFzniwnSyZfZ7v7na");
        categories.add("KZFzniwnSyZfZ7v7nn");
        categories.add("KZFzniwnSyZfZ7v7n1");
        RequestQueue queue = Volley.newRequestQueue(getActivity());
        String url = "https://sm-assign8.wl.r.appspot.com/searchEvents?keyword=" + keyword + "&segmentId=" + categories.get(category) + "&radius=" + distance + "&unit=miles&latitude=" + latitude + "&longitude="+longitude;
        Log.d(TAG, "getEvents: " + url);

        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    if(jsonObject.has("events")) {
                        JSONArray jsonArray = jsonObject.getJSONArray("events");
                        eventsList = new EventObject[jsonObject.getInt("number_of_elements")];
                        for (int i = 0; i < jsonObject.getInt("number_of_elements"); i++) {
                            eventsList[i] = new EventObject();
                            eventsList[i].setId(jsonArray.getJSONObject(i).getString("id"));
                            String id = eventsList[i].getId();
                            eventsList[i].setEvent_name(jsonArray.getJSONObject(i).getString("name"));
                            String odate = jsonArray.getJSONObject(i).getString("localDate");
                            String ndate = odate.split("-")[1] + "/" + odate.split("-")[2] + "/" + odate.split("-")[0];
                            eventsList[i].setDate(ndate);
                            String time = jsonArray.getJSONObject(i).getString("localTime");
                            if (time.isEmpty()) {
                                eventsList[i].setTime(time);
                            } else {
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                                    LocalTime t = LocalTime.parse(time);
                                    time = t.format(DateTimeFormatter.ofPattern("hh:mm a"));
                                    eventsList[i].setTime(time);
                                }
                            }
                            eventsList[i].setGenre(jsonArray.getJSONObject(i).getString("genre"));
                            eventsList[i].setVenue(jsonArray.getJSONObject(i).getString("venue"));
                            eventsList[i].setIcom_url(jsonArray.getJSONObject(i).getString("icon"));
                            SharedPreferences sharedPreferences = getActivity().getSharedPreferences("favorites_for_event_finder", Context.MODE_PRIVATE);
                            String favorites = sharedPreferences.getString("favorites", new JSONArray().toString());
                            Log.d(TAG, "onResponse: favorties : "+favorites);
                            JSONArray fav_jsonArray = new JSONArray(favorites);
                            int j;
                            for (j = 0; j < fav_jsonArray.length(); j++) {
                                if (fav_jsonArray.getJSONObject(j).getString("id").equals(id)) {
                                    eventsList[i].setFavorite(true);
                                    break;
                                }
                            }
                            if (j == fav_jsonArray.length()) {
                                eventsList[i].setFavorite(false);
                            }
                        }
                        display_table();
                    }
                    else {
                        ProgressBar progressBar = (ProgressBar) getActivity().findViewById(R.id.events_progress);
                        progressBar.setVisibility(View.GONE);
                        ConstraintLayout no_events = (ConstraintLayout) getActivity().findViewById(R.id.no_events_found);
                        no_events.setVisibility(View.VISIBLE);
                    }
                } catch (JSONException e) {
                    Log.d("JSON_ERROR_SEARCH_EVENTS", "onResponse: " + response);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG+"_Volley_Error", "onErrorResponse: "+error.toString());
            }
        });
        queue.add(stringRequest);
    }

    public void display_table() {
        RecyclerView recyclerView = (RecyclerView) getActivity().findViewById(R.id.recyclerView);
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.scrollToPosition(0);

        CustomAdapter adapter = new CustomAdapter(eventsList);
        ProgressBar progressBar = (ProgressBar) getActivity().findViewById(R.id.events_progress);
        progressBar.setVisibility(View.GONE);
        recyclerView.setAdapter(adapter);

    }

    @Override
    public void onPause() {
        super.onPause();
        paused = true;
    }

    @Override
    public void onResume() {
        super.onResume();
        if(paused) {
            paused = false;
            display_table();
        }
    }
}