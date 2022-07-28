package com.example.a2do.Adapter;

import android.annotation.SuppressLint;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.drawable.DrawableCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.a2do.Classes.Task;
import com.example.a2do.R;
import com.google.android.material.chip.Chip;

import java.util.ArrayList;

public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.MyTaskViewHolder> {

    private ArrayList<Task> lists;
    private OnItemClickListener listener;

    public interface OnItemClickListener {
        void onDeleteClick(int position);

        void onDetailsClick(int position);

        void onEditClick(int position); // bottomsheet
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }

    public TaskAdapter(ArrayList<Task> lists) {
        this.lists = lists;
    }

    public class MyTaskViewHolder extends RecyclerView.ViewHolder {

        private Chip chip;
        private TextView date;
        private TextView nameTask;
        private ConstraintLayout detailsTask;
        private ImageButton editBtn;
        private ImageButton delBtn;


        public MyTaskViewHolder(final View view, final TaskAdapter.OnItemClickListener listener) {
            super(view);
            chip = view.findViewById(R.id.chip);
            delBtn = view.findViewById(R.id.delTask);
            editBtn = view.findViewById(R.id.editTask);
            date = view.findViewById(R.id.dateTask);
            nameTask = view.findViewById(R.id.taskName);
            detailsTask = view.findViewById(R.id.taskDetail);


            delBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onDeleteClick(getAdapterPosition());
                }
            });

            chip.setOnClickListener(new View.OnClickListener() {
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
    public TaskAdapter.MyTaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_task, parent, false);
        return new TaskAdapter.MyTaskViewHolder(itemView, listener);
    }

    @SuppressLint("ResourceAsColor")
    @Override
    public void onBindViewHolder(@NonNull MyTaskViewHolder holder, int position) {
        holder.nameTask.setText(lists.get(position).getTask_description());
        holder.date.setText(lists.get(position).getTask_date());
        switch (lists.get(position).getTask_state()){
            case "done":{
                holder.chip.setText("Concluido");
                holder.chip.setChipBackgroundColorResource(R.color.done);
                break;
            }
            case "ndone":{
                holder.chip.setText("Por fazer");
                holder.chip.setChipBackgroundColorResource(R.color.ndone);
                break;
            }
            case "late":{
                holder.chip.setText("Atrasado");
                holder.chip.setChipBackgroundColorResource(R.color.late);
                break;
            }
        }
    }


    @Override
    public int getItemCount() {
        return lists.size();
    }
}
