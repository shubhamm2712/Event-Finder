package com.example.eventfinder;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.viewpager2.widget.ViewPager2;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.eventfinder.adapters.EventPagerAdapter;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONArray;
import org.json.JSONException;

public class EventCard extends AppCompatActivity implements TabLayout.OnTabSelectedListener{

    public EventObject eventObject;

    private static final String TAG = "EventDetails";

    private EventDataViewModel viewModel;

    TabLayout tabLayout;
    ViewPager2 viewPager2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_card);

        Intent intent = getIntent();
        Bundle info = intent.getExtras();
        eventObject = new EventObject();
        eventObject.setId(info.getString("id"));
        eventObject.setEvent_name(info.getString("name"));
        eventObject.setVenue(info.getString("venue"));
        eventObject.setGenre(info.getString("genre"));
        eventObject.setDate(info.getString("date"));
        eventObject.setTime(info.getString("time"));
        eventObject.setIcom_url(info.getString("icon_url"));
        eventObject.setFavorite(info.getBoolean("favorite"));

        viewModel = new ViewModelProvider(this).get(EventDataViewModel.class);
        viewModel.event_id = eventObject.getId();

        tabLayout = findViewById(R.id.event_card_tabLayout);
        viewPager2 = findViewById(R.id.event_card_vewPager);

        EventPagerAdapter adapter = new EventPagerAdapter(getSupportFragmentManager(), getLifecycle());
        viewPager2.setAdapter(adapter);

        tabLayout.addTab(tabLayout.newTab().setIcon(R.drawable.detail_green_foreground).setText("DETAILS"));
        tabLayout.addTab(tabLayout.newTab().setIcon(R.mipmap.artist_icon_foreground).setText("ARTIST(S)"));
        tabLayout.addTab(tabLayout.newTab().setIcon(R.drawable.venue_foreground).setText("VENUE"));

        tabLayout.addOnTabSelectedListener(this);

        viewPager2.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                tabLayout.selectTab(tabLayout.getTabAt(position));
            }
        });


        TextView event_card_name = (TextView) this.findViewById(R.id.event_card_name);
        event_card_name.setText(eventObject.getEvent_name());
        event_card_name.setSelected(true);
        event_card_name.setMovementMethod(new ScrollingMovementMethod());

        Button back_button = (Button) this.findViewById(R.id.event_card_back);
        back_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


        Button favorite_button = (Button) this.findViewById(R.id.event_card_favorite);
        if(eventObject.favorite) {
            favorite_button.setBackgroundColor(Color.TRANSPARENT);
        } else {
            favorite_button.setBackgroundColor(0xFF222222);
        }
        favorite_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(eventObject.favorite) {
                    favorite_button.setBackgroundColor(0xFF222222);
                    SharedPreferences sharedPreferences = v.getContext().getSharedPreferences("favorites_for_event_finder", Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    String favorites = sharedPreferences.getString("favorites", new JSONArray().toString());
                    try {
                        JSONArray jsonArray = new JSONArray(favorites);
                        JSONArray newJsonArray = new JSONArray();
                        int index = 0;
                        for (int i = 0; i < jsonArray.length(); i++) {
                            if (!jsonArray.getJSONObject(i).getString("id").equals(eventObject.id)) {
                                newJsonArray.put(jsonArray.getJSONObject(i));
                            } else {
                                index = i;
                            }
                        }
                        favorites = newJsonArray.toString();
                        editor.putString("favorites", favorites);
                        editor.commit();
                        Log.d(TAG, "onClick: " + "Removed from favorites");
                        eventObject.setFavorite(false);
                        show_toast(v, jsonArray.getJSONObject(index).getString("name") + " removed from favorites");
                    } catch (JSONException e) {
                        Log.d(TAG, "onClick: JSON Error: "+e.toString());
                    }
                } else {
                    favorite_button.setBackgroundColor(Color.TRANSPARENT);
                    SharedPreferences sharedPreferences = v.getContext().getSharedPreferences("favorites_for_event_finder", Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    String favorites = sharedPreferences.getString("favorites", new JSONArray().toString());
                    try {
                        JSONArray jsonArray = new JSONArray(favorites);
                        jsonArray.put(eventObject.toJson());
                        favorites = jsonArray.toString();
                        editor.putString("favorites", favorites);
                        editor.commit();
                        Log.d(TAG, "onClick: " + "Added in favorites");
                        eventObject.setFavorite(true);
                        show_toast(v, eventObject.event_name + " added to favorites");
                    } catch (JSONException e) {
                        Log.d(TAG, "onClick: JSON Error: "+e.toString());
                    }
                }
            }
        });
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
    public void onTabSelected(TabLayout.Tab tab) {
        viewPager2.setCurrentItem(tab.getPosition());
    }

    @Override
    public void onTabUnselected(TabLayout.Tab tab) {

    }

    @Override
    public void onTabReselected(TabLayout.Tab tab) {

    }
}