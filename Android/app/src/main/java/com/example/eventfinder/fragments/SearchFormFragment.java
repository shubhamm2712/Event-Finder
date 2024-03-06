package com.example.eventfinder.fragments;

import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Bundle;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.SwitchCompat;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.eventfinder.MainActivity;
import com.example.eventfinder.R;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.switchmaterial.SwitchMaterial;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;

import java.util.ArrayList;

public class SearchFormFragment extends Fragment {

    private static final String TAG = "MyActivity_SearchForm";

    public String keyword;
    public Integer distance;
    public Integer category;
    public Boolean auto_det;
    public String location;

    public ArrayAdapter<String> adapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_search_form, container, false);

        Bundle bundle = getArguments();
        if(bundle==null) {
            keyword = "";
            distance = 10;
            category = 0;
            auto_det = false;
            location = "";
        } else {
            keyword = getArguments().getString("keyword");
            distance = getArguments().getInt("distance");
            category = getArguments().getInt("category");
            auto_det = getArguments().getBoolean("auto_det");
            location = getArguments().getString("location");
        }

        Spinner category = view.findViewById(R.id.form_category);
        ArrayAdapter spinnerAdapter = ArrayAdapter.createFromResource(getActivity(), R.array.categories, R.layout.spinner_item);
        spinnerAdapter.setDropDownViewResource(R.layout.dropdown_item);
        category.setAdapter(spinnerAdapter);

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if(ContextCompat.checkSelfPermission(getActivity(), "android.permission.ACCESS_COARSE_LOCATION") == PackageManager.PERMISSION_DENIED) {
            if(shouldShowRequestPermissionRationale("android.permission.ACCESS_COARSE_LOCATION")) {

            } else {
                ActivityCompat.requestPermissions(getActivity(), new String[]  {"android.permission.ACCESS_COARSE_LOCATION"}, 309);
            }
        }

        update_all_fields(view);
        NavController navController = Navigation.findNavController(view);

        Button button = view.findViewById(R.id.search_button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                handle_submit();

                if(keyword.isEmpty()) {
                    show_toast("Please fill all fields");
                    return;
                }
                if(!auto_det && location.isEmpty()) {
                    show_toast("Please fill all fields");
                    return;
                }


                Bundle bundle = new Bundle();
                bundle.putString("keyword", keyword);
                bundle.putInt("distance", distance);
                bundle.putInt("category", category);
                bundle.putBoolean("auto_det", auto_det);
                bundle.putString("location", location);

                navController.navigate(R.id.action_searchFormFragment_to_eventsListFragment, bundle);
            }
        });

        button = view.findViewById(R.id.clear_button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handle_clear();
            }
        });

        SwitchCompat auto_det_switch = view.findViewById(R.id.form_auto_det);
        auto_det_switch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handle_auto_det();
            }
        });

        AutoCompleteTextView keyword_field = view.findViewById(R.id.form_keyword);
        keyword_field.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                handle_keyword_change();
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    public void show_toast(String message) {
//        LayoutInflater inflater = getLayoutInflater();
//        View layout = inflater.inflate(R.layout.my_toast, (ViewGroup) getActivity().findViewById(R.id.toast_layout));
//        TextView tv = (TextView) layout.findViewById(R.id.txtvw);
//        tv.setText(message);
        Snackbar snackbar = Snackbar.make(getView(), message, Snackbar.LENGTH_LONG);
        snackbar.setTextColor(Color.BLACK);
        snackbar.setBackgroundTint(Color.argb(255,180, 180, 180));
        View snackbarView = snackbar.getView();
        snackbarView.setTranslationY(-80);
        snackbarView.setTranslationX(70);
        ViewGroup.LayoutParams params = snackbarView.getLayoutParams();
        params.width = 880;
        snackbarView.setLayoutParams(params);
        snackbar.show();
    }


    public void get_autocomplete() {
        AutoCompleteTextView keyword_field = getActivity().findViewById(R.id.form_keyword);
        RequestQueue queue = Volley.newRequestQueue(getActivity());
        String url = "https://sm-assign8.wl.r.appspot.com/autocomplete?keyword="+keyword;
        ArrayList<String> auto_complete_list = new ArrayList<String>();

        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONObject jsonObject = new JSONObject(response);
                            JSONArray array = jsonObject.getJSONArray("names");
                            for(int i = 0 ; i<array.length();i++) {
                                auto_complete_list.add(array.getString(i));
                            }
                            String[] list = auto_complete_list.toArray(new String[auto_complete_list.size()]);
                            adapter = new ArrayAdapter<String>(getActivity(), R.layout.autocomplete_dropdown, list);
                            keyword_field.setAdapter(adapter);
                        } catch (JSONException e) {
                            Log.d("JSON_ERROR_AUTOCOMPLETE", "onResponse: "+response);
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

    public void handle_keyword_change() {
        AutoCompleteTextView keyword_field = getActivity().findViewById(R.id.form_keyword);
        keyword = keyword_field.getText().toString().trim();
        get_autocomplete();
    }

    public void handle_submit() {
        handle_category_change();
        handle_distance_change();
        handle_location_change();
    }

    public void handle_category_change() {
        Spinner category_field = getActivity().findViewById(R.id.form_category);
        category = category_field.getSelectedItemPosition();
    }

    public void handle_location_change() {
        EditText location_field = getActivity().findViewById(R.id.form_location);
        location = location_field.getText().toString().trim();
    }

    public void handle_distance_change() {
        EditText distance_field = getActivity().findViewById(R.id.form_distance);
        distance = Integer.valueOf(distance_field.getText().toString());
    }

    public void handle_clear() {
        keyword = "";
        distance = 10;
        category = 0;
        auto_det = false;
        location = "";
        AutoCompleteTextView form_keyword = getActivity().findViewById(R.id.form_keyword);
        EditText form_distance = getActivity().findViewById(R.id.form_distance);
        Spinner form_category = getActivity().findViewById(R.id.form_category);
        SwitchCompat form_auto_det = getActivity().findViewById(R.id.form_auto_det);
        EditText form_location = getActivity().findViewById(R.id.form_location);
        form_keyword.setText(keyword);
        form_distance.setText(""+distance);
        form_category.setSelection(category);
        if(auto_det) {
            location = "";
            form_location.setText(location);
            form_location.setVisibility(View.GONE);
            form_auto_det.setChecked(true);
        } else {
            form_location.setVisibility(View.VISIBLE);
            form_location.setText(location);
            form_auto_det.setChecked(false);
        }
    }

    public void handle_auto_det() {
        SwitchCompat auto_det_switch = getActivity().findViewById(R.id.form_auto_det);
        EditText location_form = getActivity().findViewById(R.id.form_location);

        if(auto_det_switch.isChecked()) {
            auto_det = true;
            location_form.setText("");
            location_form.setVisibility(View.GONE);
            location = "";
        } else {
            auto_det = false;
            location_form.setVisibility(View.VISIBLE);
        }
    }

    public void update_all_fields(View view) {
        AutoCompleteTextView form_keyword = view.findViewById(R.id.form_keyword);
        EditText form_distance = view.findViewById(R.id.form_distance);
        Spinner form_category = view.findViewById(R.id.form_category);
        SwitchCompat form_auto_det = view.findViewById(R.id.form_auto_det);
        EditText form_location = view.findViewById(R.id.form_location);
        form_keyword.setText(keyword);
        form_distance.setText(""+distance);
        form_category.setSelection(category);
        if(auto_det) {
            location = "";
            form_location.setText(location);
            form_location.setVisibility(View.GONE);
            form_auto_det.setChecked(true);
        } else {
            form_location.setVisibility(View.VISIBLE);
            form_location.setText(location);
            form_auto_det.setChecked(false);
        }
    }
}