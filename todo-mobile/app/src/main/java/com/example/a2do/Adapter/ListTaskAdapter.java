package com.example.a2do.Adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.example.a2do.Classes.List;
import com.example.a2do.R;

import java.util.ArrayList;

public class ListTaskAdapter extends RecyclerView.Adapter<ListTaskAdapter.MyViewHolder> {

    private ArrayList<List> lists;
    private OnItemClickListener listener;

    public interface OnItemClickListener{
        void onDeleteClick(int position);
        void onDetailsClick(int position);
        void onEditClick(int position);
    }

    public void setOnItemClickListener(OnItemClickListener listener){ this.listener = listener;}

    public ListTaskAdapter(ArrayList<List> lists) {
        this.lists = lists;
    }


    public class MyViewHolder extends RecyclerView.ViewHolder{

        private TextView listName;
        private ConstraintLayout detailsBtn;
        private ImageButton editBtn;
        private ImageButton delBtn;

        public MyViewHolder(final View view, final OnItemClickListener listener){
            super(view);
            listName = view.findViewById(R.id.listName);
            delBtn = view.findViewById(R.id.delBtn);
            editBtn = view.findViewById(R.id.editBtn);
            detailsBtn = view.findViewById(R.id.detailsList);

            delBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onDeleteClick(getAdapterPosition());
                }
            });

            detailsBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onDetailsClick(getAdapterPosition());
                }
            });

            editBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onEditClick(getAdapterPosition());
                }
            });


        }


    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_list,parent,false);
        return new MyViewHolder(itemView,listener);
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        String name = lists.get(position).getList_name();
        holder.listName.setText(name);


    }

    @Override
    public int getItemCount() {
        if (lists == null) return 0;
        return lists.size();
    }
}
