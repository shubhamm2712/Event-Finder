package com.example.eventfinder.adapters;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.example.eventfinder.fragments.ArtistsTabFragment;
import com.example.eventfinder.fragments.EventDetailsFragment;
import com.example.eventfinder.fragments.FavoritesFragment;
import com.example.eventfinder.fragments.SearchTabFragment;
import com.example.eventfinder.fragments.VenueTabFragment;

public class EventPagerAdapter extends FragmentStateAdapter {
    public EventPagerAdapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle) {
        super(fragmentManager, lifecycle);
    }

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        if(position == 0) {
            return new EventDetailsFragment();
        } else if (position == 1) {
            return new ArtistsTabFragment();
        }
        return new VenueTabFragment();
    }

    @Override
    public int getItemCount() {
        return 3;
    }
}
