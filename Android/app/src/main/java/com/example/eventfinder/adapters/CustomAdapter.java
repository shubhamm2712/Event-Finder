package com.example.eventfinder.adapters;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.eventfinder.EventCard;
import com.example.eventfinder.EventObject;
import com.example.eventfinder.R;
import com.google.android.material.snackbar.Snackbar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class CustomAdapter extends RecyclerView.Adapter<CustomAdapter.ViewHolder> {

    public EventObject[] eventsList;
    public String TAG = "CustomAdapter";

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.event_list_row, parent, false);

        return new ViewHolder(v);
    }

    public void show_toast(View v,String message) {
        Snackbar snackbar = Snackbar.make(v, message, Snackbar.LENGTH_LONG);
        snackbar.setTextColor(Color.BLACK);
        snackbar.setBackgroundTint(Color.argb(255,180, 180, 180));
        View snackbarView = snackbar.getView();
        snackbarView.setTranslationY(-40);
        snackbarView.setTranslationX(20);
        ViewGroup.LayoutParams params = snackbarView.getLayoutParams();
        params.width = 930;
        snackbarView.setLayoutParams(params);
        snackbar.show();
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.event_name.setText(eventsList[position].event_name);
        holder.event_name.setSelected(true);
        holder.event_name.setMovementMethod(new ScrollingMovementMethod());
        holder.event_venue.setText(eventsList[position].venue);
        holder.event_venue.setSelected(true);
        holder.event_venue.setMovementMethod(new ScrollingMovementMethod());
        holder.event_genue.setText(eventsList[position].genre);
        holder.event_date.setText(eventsList[position].date);
        holder.event_time.setText(eventsList[position].time);
        JSONObject json = eventsList[position].toJson();
        String id = eventsList[position].id;
        int p = position;
        Glide.with(holder.itemView).load(eventsList[position].icom_url).centerCrop().into(holder.event_icon);
        SharedPreferences sharedPreferences = holder.itemView.getContext().getSharedPreferences("favorites_for_event_finder", Context.MODE_PRIVATE);
        String favorites = sharedPreferences.getString("favorites", new JSONArray().toString());
        Log.d(TAG, "onResponse: favorties : "+favorites);
        JSONArray fav_jsonArray = null;
        try {
            fav_jsonArray = new JSONArray(favorites);
            int j;
            for (j = 0; j < fav_jsonArray.length(); j++) {
                if (fav_jsonArray.getJSONObject(j).getString("id").equals(eventsList[position].id)) {
                    eventsList[position].setFavorite(true);
                    break;
                }
            }
            if (j == fav_jsonArray.length()) {
                eventsList[position].setFavorite(false);
            }
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        if(eventsList[position].favorite) {
//            holder.event_unfavorite_button.setVisibility(View.VISIBLE);
//            holder.event_favorite_button.setVisibility(View.GONE);
            holder.event_favorite_button.setBackgroundColor(Color.TRANSPARENT);
            holder.event_favorite_button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d(TAG, "onClick: unfavorite" + id);
                    SharedPreferences sharedPreferences = v.getContext().getSharedPreferences("favorites_for_event_finder", Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    String favorites = sharedPreferences.getString("favorites", new JSONArray().toString());
                    try {
                        JSONArray jsonArray = new JSONArray(favorites);
                        JSONArray newJsonArray = new JSONArray();
                        int index = 0;
                        for (int i = 0; i < jsonArray.length(); i++) {
                            if (!jsonArray.getJSONObject(i).getString("id").equals(id)) {
                                newJsonArray.put(jsonArray.getJSONObject(i));
                            } else {
                                index = i;
                            }
                        }
                        favorites = newJsonArray.toString();
                        editor.putString("favorites", favorites);
                        editor.commit();
                        Log.d(TAG, "onClick: " + "Removed from favorites");
                        eventsList[p].setFavorite(false);
                        show_toast(v, jsonArray.getJSONObject(index).getString("name") + " removed from favorites");
                        notifyItemChanged(p);
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                }
            });
        } else {
//            holder.event_unfavorite_button.setVisibility(View.GONE);
//            holder.event_favorite_button.setVisibility(View.VISIBLE);
            holder.event_favorite_button.setBackgroundColor(Color.BLACK);
            holder.event_favorite_button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d(TAG, "onClick: favorite" + id);
                    SharedPreferences sharedPreferences = v.getContext().getSharedPreferences("favorites_for_event_finder", Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    String favorites = sharedPreferences.getString("favorites", new JSONArray().toString());
                    try {
                        JSONArray jsonArray = new JSONArray(favorites);
                        jsonArray.put(json);
                        favorites = jsonArray.toString();
                        editor.putString("favorites", favorites);
                        editor.commit();
                        Log.d(TAG, "onClick: " + "Added in favorites");
                        eventsList[p].setFavorite(true);
                        show_toast(v, json.getString("name") + " added to favorites");
                        notifyItemChanged(p);
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                }
            });
        }
        View.OnClickListener onclick = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d(TAG, "onClick: clicked "+id);
                Intent intent = new Intent(v.getContext(), EventCard.class);
                Bundle info = new Bundle();
                info.putString("id",id);
                info.putString("name",eventsList[p].event_name);
                info.putString("venue",eventsList[p].venue);
                info.putString("genre",eventsList[p].genre);
                info.putString("date",eventsList[p].date);
                info.putString("time",eventsList[p].time);
                info.putString("icon_url",eventsList[p].icom_url);
                info.putBoolean("favorite",eventsList[p].favorite);
                intent.putExtras(info);
                v.getContext().startActivity(intent);
            }
        };

        holder.event_row.setOnClickListener(onclick);
        holder.event_name.setOnClickListener(onclick);
        holder.event_venue.setOnClickListener(onclick);
        holder.event_time.setOnClickListener(onclick);
        holder.event_date.setOnClickListener(onclick);
        holder.event_icon.setOnClickListener(onclick);
        holder.event_genue.setOnClickListener(onclick);
    }

    @Override
    public int getItemCount() {
        return eventsList.length;
    }

    public CustomAdapter(EventObject[] eventsList) {
        this.eventsList = eventsList;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView event_name,event_date, event_time, event_venue, event_genue;
        public ImageView event_icon;
        public Button event_favorite_button,event_unfavorite_button;
        public FrameLayout event_row;

        public ViewHolder(View v) {
            super(v);

            event_row = (FrameLayout) v.findViewById(R.id.events_list_row);
            event_name = (TextView) v.findViewById(R.id.events_list_name);
            event_venue = (TextView) v.findViewById(R.id.events_list_venue);
            event_genue = (TextView) v.findViewById(R.id.events_list_genre);
            event_date = (TextView) v.findViewById(R.id.events_list_date);
            event_time = (TextView) v.findViewById(R.id.events_list_time);
            event_icon = (ImageView) v.findViewById(R.id.events_list_icon);
            event_favorite_button = (Button) v.findViewById(R.id.events_list_favorite_button);
            event_unfavorite_button = (Button) v.findViewById(R.id.events_list_unfavorite_button);
        }
    }
}
