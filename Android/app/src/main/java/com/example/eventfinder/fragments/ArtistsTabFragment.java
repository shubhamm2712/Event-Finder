package com.example.eventfinder.fragments;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.eventfinder.EventDataViewModel;
import com.example.eventfinder.R;
import com.example.eventfinder.adapters.ArtistAdapter;
import com.example.eventfinder.adapters.CustomAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ArtistsTabFragment extends Fragment {

    private EventDataViewModel viewModel;

    public String TAG = "ArtistsTabFragment";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_artists_tab, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Log.d(TAG, "onViewCreated: Calling everything in Artists tab");

        viewModel = new ViewModelProvider(getActivity()).get(EventDataViewModel.class);
        String url = viewModel.spotify_url;
        if(!url.isEmpty()) {
            RequestQueue queue = Volley.newRequestQueue(getActivity());
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    try {
                        JSONObject jsonObject = new JSONObject(response);
                        JSONArray jsonArray = jsonObject.getJSONArray("artists");
                        if(jsonArray.length()==0) {
                            display_no_artist(view);
                        } else {
                            display_artists(jsonArray);
                        }
                    } catch (JSONException e) {
                        Log.d(TAG, "onResponse: JSON error : "+response);
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d(TAG, "onErrorResponse: Volley error " + error.toString());
                }
            });
            queue.add(stringRequest);
        } else {
            display_no_artist(view);
        }
    }

    public void display_no_artist(View v) {
        Log.d(TAG, "display_no_artist: No artists");
        ProgressBar progressBar = (ProgressBar) v.findViewById(R.id.artists_progress_bar);
//        progressBar.setVisibility(View.GONE);
        ConstraintLayout no_artists = (ConstraintLayout) v.findViewById(R.id.no_artists);
        no_artists.setVisibility(View.VISIBLE);
    }

    public void display_artists(JSONArray jsonArray) {
        Log.d(TAG, "display_artists: spotify parsed : "+jsonArray.length());

        RecyclerView recyclerView = (RecyclerView) getActivity().findViewById(R.id.recyclerView_artists);
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.scrollToPosition(0);

        ArtistAdapter adapter = new ArtistAdapter(jsonArray);
        ProgressBar progressBar = (ProgressBar) getActivity().findViewById(R.id.artists_progress_bar);
        progressBar.setVisibility(View.GONE);
        recyclerView.setAdapter(adapter);
    }
}