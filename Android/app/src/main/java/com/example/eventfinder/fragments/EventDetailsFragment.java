package com.example.eventfinder.fragments;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.text.SpannableString;
import android.text.method.ScrollingMovementMethod;
import android.text.style.UnderlineSpan;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.bumptech.glide.Glide;
import com.example.eventfinder.EventCard;
import com.example.eventfinder.EventDataViewModel;
import com.example.eventfinder.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

class Artist {
    public String artist_name;
    public Boolean artist_music;
    public Artist(String name, Boolean music) {
        artist_music = music;
        artist_name = name;
    }
}

class EventDetail {
    public String id;
    public String name;
    public String date;
    public String time;
    public int number_artists;
    public ArrayList<Artist> artists;
    public String venue;
    public String subgenre;
    public String genre;
    public String segment;
    public String subtype;
    public String type;
    public String min;
    public String max;
    public String ticket_status;
    public String buy_ticket;
    public String seatmap;
}

public class EventDetailsFragment extends Fragment {

    private EventDataViewModel viewModel;

    private String TAG = "EventDetailsFragment";

    public String id;

    public EventDetail event;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_event_details, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(getActivity()).get(EventDataViewModel.class);
        id = viewModel.event_id;
        Log.d(TAG, "onViewCreated: id is "+id);

        RequestQueue queue = Volley.newRequestQueue(getActivity());
        String url = "https://sm-assign8.wl.r.appspot.com/eventDetails?id="+id;
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    event = new EventDetail();
                    event.id = id;
                    event.name = jsonObject.getString("name");
                    event.date = parseDate(jsonObject.getString("localDate"));
                    String time = jsonObject.getString("localTime");
                    if (time.isEmpty()) {
                        event.time = time;
                    } else {
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                            LocalTime t = LocalTime.parse(time);
                            time = t.format(DateTimeFormatter.ofPattern("hh:mm a"));
                            event.time = time;
                        }
                    }
                    event.number_artists = jsonObject.getInt("num_artists");
                    event.artists = new ArrayList<Artist>();
                    JSONArray jsonArray = jsonObject.getJSONArray("artists");
                    Boolean is_music = false;
                    String spotify = "https://sm-assign8.wl.r.appspot.com//spotifyLink?keyword=1";
                    for(int i = 0 ; i<event.number_artists;i++) {
                        event.artists.add(new Artist(jsonArray.getJSONObject(i).getString("name"),jsonArray.getJSONObject(i).getBoolean("music")));
                        if(event.artists.get(i).artist_music) {
                            is_music = true;
                            spotify+= "&keyword="+event.artists.get(i).artist_name;
                        }
                    }
                    if(is_music) {
                        viewModel.spotify_url = spotify;
                    }
                    event.venue = jsonObject.getString("venue");
                    if(!event.venue.isEmpty()) {
                        String venue = "https://sm-assign8.wl.r.appspot.com//venueDetails?keyword=" + event.venue;
                        viewModel.venue_url = venue;
                    }
                    event.subgenre = jsonObject.getString("subgenre");
                    event.genre = jsonObject.getString("genre");
                    event.segment = jsonObject.getString("segment");
                    event.subtype = jsonObject.getString("subType");
                    event.type = jsonObject.getString("type");
                    event.min = jsonObject.getString("min");
                    event.max = jsonObject.getString("max");
                    event.ticket_status = jsonObject.getString("ticket_status");
                    event.buy_ticket = jsonObject.getString("buy_ticket");
                    event.seatmap = jsonObject.getString("seatmap");
                    
                    display_event();
                } catch (JSONException e) {
                    Log.d(TAG, "onResponse: JSON error : " + response);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "onErrorResponse: Volley error" + error.toString());
            }
        });
        queue.add(stringRequest);
    }

    public String getmonth(String month) {
        String[] months = new String[] {"Jan", "Feb", "Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        return months[Integer.parseInt(month)-1];
    }
    public String parseDate(String odate) {
        String new_date = "";
        if(!odate.isEmpty()) {
            new_date = odate.split("-")[0];
            new_date = odate.split("-")[2]+", "+new_date;
            new_date = getmonth(odate.split("-")[1])+" "+new_date;
        }
        return new_date;
    }
    
    public void display_event() {
        Log.d(TAG, "display_event: Event parsed");

        ImageView facebook_button = (ImageView) getActivity().findViewById(R.id.event_card_facebook);
        facebook_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent openUrl = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.facebook.com/sharer/sharer.php?u="+event.buy_ticket+"&amp;src=sdkpreparse"));
                startActivity(openUrl);
            }
        });

        ImageView twitter_button = (ImageView) getActivity().findViewById(R.id.event_card_twitter);
        twitter_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent openUrl = new Intent(Intent.ACTION_VIEW, Uri.parse("http://twitter.com/share?text=Check "+event.name+" on Ticketmaster.&url="+event.buy_ticket+""));
                startActivity(openUrl);
            }
        });

        ConstraintLayout artist_row = (ConstraintLayout) getActivity().findViewById(R.id.event_detail_artist_row);
        TextView artist_field = (TextView) getActivity().findViewById(R.id.event_detail_artist);
        if(event.number_artists<1) {
            artist_row.setVisibility(View.GONE);
        } else {
            String artist_string = "";
            for(int i = 0;i<event.number_artists;i++) {
                if(artist_string.isEmpty() && !event.artists.get(i).artist_name.isEmpty()) {
                    artist_string += event.artists.get(i).artist_name;
                } else if(!event.artists.get(i).artist_name.isEmpty()) {
                    artist_string += " | "+event.artists.get(i).artist_name;
                }
            }
            if(artist_string.isEmpty()) {
                artist_row.setVisibility(View.GONE);
            } else {
                artist_field.setText(artist_string);
                artist_field.setSelected(true);
                artist_field.setMovementMethod(new ScrollingMovementMethod());
            }
        }

        ConstraintLayout venue_row = (ConstraintLayout) getActivity().findViewById(R.id.event_detail_venue_row);
        TextView venue_field = (TextView) getActivity().findViewById(R.id.event_detail_venue);
        if(event.venue.isEmpty()) {
            venue_row.setVisibility(View.GONE);
        } else {
            venue_field.setText(event.venue);
            venue_field.setSelected(true);
            venue_field.setMovementMethod(new ScrollingMovementMethod());
        }

        ConstraintLayout date_row = (ConstraintLayout) getActivity().findViewById(R.id.event_detail_date_row);
        TextView date_field = (TextView) getActivity().findViewById(R.id.event_detail_date);
        if(event.date.isEmpty()) {
            date_row.setVisibility(View.GONE);
        } else {
            date_field.setText(event.date);
        }

        ConstraintLayout time_row = (ConstraintLayout) getActivity().findViewById(R.id.event_detail_time_row);
        TextView time_field = (TextView) getActivity().findViewById(R.id.event_detail_time);
        if(event.time.isEmpty()) {
            time_row.setVisibility(View.GONE);
        } else {
            time_field.setText(event.time);
        }

        ConstraintLayout genre_row = (ConstraintLayout) getActivity().findViewById(R.id.event_detail_genres_row);
        TextView genre_field = (TextView) getActivity().findViewById(R.id.event_detail_genres);
        String genre_string = "";
        String[] fields = new String[] {event.segment, event.genre, event.subgenre, event.type, event.subtype};
        for(int i = 0;i<5;i++) {
            if(!fields[i].isEmpty()) {
                if(genre_string.isEmpty()) {
                    genre_string += fields[i];
                } else {
                    genre_string += " | " + fields[i];
                }
            }
        }
        if(genre_string.isEmpty()) {
            genre_row.setVisibility(View.GONE);
        } else {
            genre_field.setText(genre_string);
            genre_field.setSelected(true);
            genre_field.setMovementMethod(new ScrollingMovementMethod());
        }

        ConstraintLayout price_row = (ConstraintLayout) getActivity().findViewById(R.id.event_detail_price_row);
        TextView price_field = (TextView) getActivity().findViewById(R.id.event_detail_price);
        if(event.max.isEmpty() && event.min.isEmpty()) {
            price_row.setVisibility(View.GONE);
        } else {
            if(event.min.isEmpty()) {
                event.min = event.max;
            } else if(event.max.isEmpty()) {
                event.max = event.min;
            }
            price_field.setText(event.min +" - "+event.max+" (USD)");
            price_field.setSelected(true);
            price_field.setMovementMethod(new ScrollingMovementMethod());
        }

        ConstraintLayout status_row = (ConstraintLayout) getActivity().findViewById(R.id.event_detail_status_row);
        TextView status_field = (TextView) getActivity().findViewById(R.id.event_detail_status);
        if(event.ticket_status.isEmpty()) {
            status_row.setVisibility(View.GONE);
        } else {
            if(event.ticket_status.equals("onsale")) {
                status_field.setText("On Sale");
                status_field.setBackgroundResource(R.drawable.status_green);
            } else if(event.ticket_status.equals("offsale")) {
                status_field.setText("Off Sale");
                status_field.setBackgroundResource(R.drawable.status_red);
            } else if(event.ticket_status.equals("canceled") || event.ticket_status.equals("cancelled")) {
                status_field.setText("Canceled");
                status_field.setBackgroundResource(R.drawable.status_black);
            } else if(event.ticket_status.equals("postponed")) {
                status_field.setText("Postponed");
                status_field.setBackgroundResource(R.drawable.status_orange);
            } else if(event.ticket_status.equals("rescheduled")) {
                status_field.setText("Rescheduled");
                status_field.setBackgroundResource(R.drawable.status_orange);
            }
        }

        ConstraintLayout buy_row = (ConstraintLayout) getActivity().findViewById(R.id.event_detail_buy_row);
        TextView buy_field = (TextView) getActivity().findViewById(R.id.event_detail_buy);
        if(event.buy_ticket.isEmpty()) {
            buy_row.setVisibility(View.GONE);
        } else {
            SpannableString s = new SpannableString(event.buy_ticket);
            s.setSpan(new UnderlineSpan(), 0, s.length(), 0);
            buy_field.setText(s);
            buy_field.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent openUrl = new Intent(Intent.ACTION_VIEW, Uri.parse(event.buy_ticket));
                    startActivity(openUrl);
                }
            });
            buy_field.setSelected(true);
            buy_field.setMovementMethod(new ScrollingMovementMethod());
        }

        if(!event.seatmap.isEmpty()) {
            ImageView seatmap_field = (ImageView) getActivity().findViewById(R.id.event_detail_image);
            Glide.with(getActivity()).load(event.seatmap).into(seatmap_field);
        }

        ProgressBar progressBar = (ProgressBar) getActivity().findViewById(R.id.event_details_progress);
        progressBar.setVisibility(View.GONE);

        LinearLayout event_detail_block = (LinearLayout) getActivity().findViewById(R.id.event_detail_block);
        event_detail_block.setVisibility(View.VISIBLE);
    }
}