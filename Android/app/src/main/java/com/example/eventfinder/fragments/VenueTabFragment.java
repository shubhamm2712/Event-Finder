package com.example.eventfinder.fragments;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.eventfinder.EventDataViewModel;
import com.example.eventfinder.R;
import com.example.eventfinder.adapters.PagerAdapter;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONException;
import org.json.JSONObject;

import at.blogc.android.views.ExpandableTextView;

public class VenueTabFragment extends Fragment implements OnMapReadyCallback {

    private EventDataViewModel viewModel;

    public String latitude, longitude;

    private GoogleMap mMap;

    public String TAG = "VenueTabFragment";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_venue_tab, container, false);

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Log.d(TAG, "onViewCreated: Calling everything in venue tab");

        viewModel = new ViewModelProvider(getActivity()).get(EventDataViewModel.class);
        String url = viewModel.venue_url;
        if(url.isEmpty()) {
            display_no_venue();
        } else {
            RequestQueue queue = Volley.newRequestQueue(getActivity());
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    try {
                        JSONObject jsonObject = new JSONObject(response);
                        display_venue(jsonObject);
                    } catch (JSONException e) {
                        Log.d(TAG, "onResponse: JSON error : "+response);
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.d(TAG, "onErrorResponse: Volley error : "+error.toString());
                }
            });
            queue.add(stringRequest);
        }
    }

    public void display_no_venue() {
        Log.d(TAG, "display_no_venue: No Venue");
    }

    public void display_venue(JSONObject jsonObject) {
        try {
            Log.d(TAG, "display_venue: "+jsonObject.getString("name"));

            latitude = jsonObject.getString("latitude");
            longitude = jsonObject.getString("longitude");

            SupportMapFragment mapFragment = (SupportMapFragment)  getChildFragmentManager().findFragmentById(R.id.map);
            mapFragment.getMapAsync(this);

            ConstraintLayout venue_name = (ConstraintLayout) getActivity().findViewById(R.id.event_venue_name);
            TextView venue_name_text = (TextView) getActivity().findViewById(R.id.event_venue_name_text);
//            if(venue_name_text == null) {
//                return;
//            }
            if(jsonObject.getString("name").isEmpty()) {
                venue_name.setVisibility(View.GONE);
            } else {
                venue_name_text.setText(jsonObject.getString("name"));
                venue_name_text.setSelected(true);
                venue_name_text.setMovementMethod(new ScrollingMovementMethod());
            }

            ConstraintLayout venue_address = (ConstraintLayout) getActivity().findViewById(R.id.event_venue_address);
            TextView venue_address_text = (TextView) getActivity().findViewById(R.id.event_venue_address_text);
            if(jsonObject.getString("address").isEmpty()) {
                venue_address.setVisibility(View.GONE);
            } else {
                venue_address_text.setText(jsonObject.getString("address"));
                venue_address_text.setSelected(true);
                venue_address_text.setMovementMethod(new ScrollingMovementMethod());
            }

            String city = jsonObject.getString("city");
            if(city.isEmpty()) {
                city = jsonObject.getString("state");
            } else if (!jsonObject.getString("state").isEmpty()) {
                city += ", " + jsonObject.getString("state");
            }

            ConstraintLayout venue_city = (ConstraintLayout) getActivity().findViewById(R.id.event_venue_city);
            TextView venue_city_text = (TextView) getActivity().findViewById(R.id.event_venue_city_text);
            if(city.isEmpty()) {
                venue_city.setVisibility(View.GONE);
            } else {
                venue_city_text.setText(city);
                venue_city_text.setSelected(true);
                venue_city_text.setMovementMethod(new ScrollingMovementMethod());
            }

            ConstraintLayout venue_contact = (ConstraintLayout) getActivity().findViewById(R.id.event_venue_contact);
            TextView venue_contact_text = (TextView) getActivity().findViewById(R.id.event_venue_contact_text);
            if(jsonObject.getString("phoneNumber").isEmpty()) {
                venue_contact.setVisibility(View.GONE);
            } else {
                venue_contact_text.setText(jsonObject.getString("phoneNumber"));
                venue_contact_text.setSelected(true);
                venue_contact_text.setMovementMethod(new ScrollingMovementMethod());
            }

            TextView venue_open_hour = (TextView) getActivity().findViewById(R.id.open_hours_label);
            TextView venue_open_hour_text = (TextView) getActivity().findViewById(R.id.open_hours_text);
            if(jsonObject.getString("openHours").isEmpty()) {
                venue_open_hour.setVisibility(View.GONE);
                venue_open_hour_text.setVisibility(View.GONE);
            } else {
                venue_open_hour_text.setText(jsonObject.getString("openHours"));
                venue_open_hour_text.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if(venue_open_hour_text.getMaxLines() == 3) {
                            venue_open_hour_text.setMaxLines(200);
                        } else {
                            venue_open_hour_text.setMaxLines(3);
                        }
                    }
                });
            }

            TextView venue_gen_rules = (TextView) getActivity().findViewById(R.id.gen_rules_label);
            TextView venue_gen_rules_text = (TextView) getActivity().findViewById(R.id.gen_rules_text);
            if(jsonObject.getString("generalRule").isEmpty()) {
                venue_gen_rules.setVisibility(View.GONE);
                venue_gen_rules_text.setVisibility(View.GONE);
            } else {
                venue_gen_rules_text.setText(jsonObject.getString("generalRule"));
                venue_gen_rules_text.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if(venue_gen_rules_text.getMaxLines() == 3) {
                            venue_gen_rules_text.setMaxLines(200);
                        } else {
                            venue_gen_rules_text.setMaxLines(3);
                        }
                    }
                });
            }

            TextView venue_child_rules = (TextView) getActivity().findViewById(R.id.child_rules_label);
            TextView venue_child_rules_text = (TextView) getActivity().findViewById(R.id.child_rules_text);
            if(jsonObject.getString("childRule").isEmpty()) {
                venue_child_rules.setVisibility(View.GONE);
                venue_child_rules_text.setVisibility(View.GONE);
            } else {
                venue_child_rules_text.setText(jsonObject.getString("childRule"));
                venue_child_rules_text.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if(venue_child_rules_text.getMaxLines() == 3) {
                            venue_child_rules_text.setMaxLines(200);
                        } else {
                            venue_child_rules_text.setMaxLines(3);
                        }
                    }
                });
            }

            if(venue_child_rules.getVisibility()==View.GONE && venue_gen_rules.getVisibility()==View.GONE && venue_open_hour.getVisibility()==View.GONE) {
                LinearLayout yellow_block = (LinearLayout) getActivity().findViewById(R.id.venue_info_block);
                yellow_block.setVisibility(View.GONE);
            }

        } catch (JSONException e) {
            Log.d(TAG, "display_venue: JSON error : " + jsonObject.toString());
        }
    }

    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        mMap = googleMap;

        // Add a marker in Sydney and move the camera
        LatLng sydney = new LatLng(Float.parseFloat(latitude), Float.parseFloat(longitude));
        Log.d(TAG, "onMapReady: "+sydney.latitude + " "+sydney.longitude);
        mMap.addMarker(new MarkerOptions()
                .position(sydney)
                .title("Marker"));
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(sydney, 12));
//        mMap.animateCamera(CameraUpdateFactory.zoomIn());
    }
}