package com.example.eventfinder;

import android.os.Build;

import androidx.annotation.NonNull;

import org.json.JSONException;
import org.json.JSONObject;

public class EventObject {
    public String date;
    public String time;
    public String icom_url;
    public String event_name;
    public String venue;
    public String genre;
    public String id;
    public Boolean favorite;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getIcom_url() {
        return icom_url;
    }

    public void setIcom_url(String icom_url) {
        this.icom_url = icom_url;
    }

    public String getEvent_name() {
        return event_name;
    }

    public void setEvent_name(String event_name) {
        this.event_name = event_name;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getFavorite() { return favorite; }

    public void setFavorite(Boolean favorite) {this.favorite = favorite;}

    public JSONObject toJson() {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("id",id);
            jsonObject.put("name",event_name);
            jsonObject.put("venue",venue);
            jsonObject.put("genre",genre);
            jsonObject.put("date",date);
            jsonObject.put("time",time);
            jsonObject.put("icon_url",icom_url);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        return jsonObject;
    }

    @NonNull
    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("id",id);
            jsonObject.put("name",event_name);
            jsonObject.put("venue",venue);
            jsonObject.put("genre",genre);
            jsonObject.put("date",date);
            jsonObject.put("time",time);
            jsonObject.put("icon_url",icom_url);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        return jsonObject.toString();
    }
}
