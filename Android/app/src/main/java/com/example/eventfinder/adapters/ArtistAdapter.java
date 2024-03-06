package com.example.eventfinder.adapters;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
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
import com.google.android.material.progressindicator.CircularProgressIndicator;
import com.google.android.material.snackbar.Snackbar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ArtistAdapter extends RecyclerView.Adapter<ArtistAdapter.ViewHolder> {

    public JSONArray artists;
    public String TAG = "ArtistAdapter";

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.artist_row, parent, false);

        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        try {
            JSONObject jsonObject = artists.getJSONObject(position);
            ArrayList<String> albums = new ArrayList<String>();
            for(int i=0;i<jsonObject.getJSONArray("albums").length();i++) {
                albums.add(jsonObject.getJSONArray("albums").getString(i));
            }
            holder.name.setText(jsonObject.getString("name"));
            holder.followers.setText(getfollowers(jsonObject.getString("followers")));
            holder.spotify_link.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent openUrl = null;
                    try {
                        openUrl = new Intent(Intent.ACTION_VIEW, Uri.parse(jsonObject.getString("link")));
                    } catch (JSONException e) {
                        openUrl = new Intent(Intent.ACTION_VIEW, Uri.parse("www.spotify.com"));
                    }
                    v.getContext().startActivity(openUrl);
                }
            });
            holder.popularity_text.setText(jsonObject.getString("popularity"));
            holder.popularity_indicator.setProgress(Integer.parseInt(jsonObject.getString("popularity")));
            Glide.with(holder.itemView).load(jsonObject.getString("image")).centerCrop().into(holder.icon);
            if(albums.size()==0) {
                holder.popular_albums.setVisibility(View.GONE);
                holder.album1.setVisibility(View.GONE);
                holder.album2.setVisibility(View.GONE);
                holder.album3.setVisibility(View.GONE);
            } else{
                if(albums.size()>=1) {
                    Glide.with(holder.itemView).load(albums.get(0)).into(holder.album1);
                }
                if(albums.size()>=2) {
                    Glide.with(holder.itemView).load(albums.get(1)).into(holder.album2);
                }
                if(albums.size()>=3) {
                    Glide.with(holder.itemView).load(albums.get(2)).into(holder.album3);
                }
            }
        } catch (JSONException e) {
            Log.d(TAG, "onBindViewHolder: JSON Error : position "+position);
        }
    }

    public String getfollowers(String s) {
        int followers = Integer.parseInt(s);
        if(followers>=1000000) {
            return ""+(followers/1000000)+"M Followers";
        } else if(followers>=1000) {
            return ""+(followers/1000)+"K Followers";
        } else {
            return ""+followers+" Followers";
        }
    }

    @Override
    public int getItemCount() {
        return artists.length();
    }

    public ArtistAdapter(JSONArray jsonArray) {
        this.artists = jsonArray;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        public ImageView icon,album1,album2,album3;
        public TextView name,followers,spotify_link,popularity_text,popular_albums;
        public CircularProgressIndicator popularity_indicator;

        public ViewHolder(View v) {
            super(v);

            icon = (ImageView) v.findViewById(R.id.artist_row_icon);
            album1 = (ImageView) v.findViewById(R.id.artist_row_album_1);
            album2 = (ImageView) v.findViewById(R.id.artist_row_album_2);
            album3 = (ImageView) v.findViewById(R.id.artist_row_album_3);
            name = (TextView) v.findViewById(R.id.artist_row_name);
            followers = (TextView) v.findViewById(R.id.artist_row_followers);
            spotify_link = (TextView) v.findViewById(R.id.artist_row_spotify_link);
            popularity_text = (TextView) v.findViewById(R.id.artist_row_popularity);
            popular_albums = (TextView) v.findViewById(R.id.artist_row_popular_albums);
            popularity_indicator = (CircularProgressIndicator) v.findViewById(R.id.artist_row_popularity_progress);
        }
    }
}
