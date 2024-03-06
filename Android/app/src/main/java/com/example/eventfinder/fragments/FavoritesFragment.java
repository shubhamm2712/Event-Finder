package com.example.eventfinder.fragments;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.eventfinder.EventObject;
import com.example.eventfinder.R;
import com.example.eventfinder.adapters.CustomAdapter;
import com.example.eventfinder.adapters.FavoriteAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class FavoritesFragment extends Fragment {

    public static String TAG = "FavoritesFragment";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_favorites, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    @Override
    public void onPause() {
        super.onPause();
        onDestroy();
    }

    @Override
    public void onResume() {
        super.onResume();

        SharedPreferences sharedPreferences = getActivity().getSharedPreferences("favorites_for_event_finder", Context.MODE_PRIVATE);
        String favorites = sharedPreferences.getString("favorites", new JSONArray().toString());
        Log.d(TAG, "onResponse: favorties : "+favorites);
        try {
            JSONArray fav_jsonArray = new JSONArray(favorites);
            EventObject[] eventLists = new EventObject[fav_jsonArray.length()];
            for(int i = 0;i < fav_jsonArray.length();i++) {
                JSONObject json = fav_jsonArray.getJSONObject(i);
                eventLists[i] = new EventObject();
                eventLists[i].setFavorite(true);
                eventLists[i].setId(json.getString("id"));
                eventLists[i].setEvent_name(json.getString("name"));
                eventLists[i].setVenue(json.getString("venue"));
                eventLists[i].setGenre(json.getString("genre"));
                eventLists[i].setDate(json.getString("date"));
                eventLists[i].setIcom_url(json.getString("icon_url"));
                eventLists[i].setTime(json.getString("time"));
            }
            RecyclerView recyclerView = (RecyclerView) getView().findViewById(R.id.recyclerView_favorites);
            RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity());
            recyclerView.setLayoutManager(layoutManager);
            recyclerView.scrollToPosition(0);

            FavoriteAdapter adapter = new FavoriteAdapter(eventLists, (ConstraintLayout) getView().findViewById(R.id.no_favorites));
            ProgressBar progressBar = (ProgressBar) getView().findViewById(R.id.favorites_progress);
            progressBar.setVisibility(View.GONE);
            recyclerView.setAdapter(adapter);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

    }
}