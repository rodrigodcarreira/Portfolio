package com.cash;

import com.cash.events.Events;
import commands.Commands;
import org.bukkit.plugin.java.JavaPlugin;

/**
 *
 * @author rodrigodcarreira
 */
public class Cash extends JavaPlugin{

    @Override
    public void onEnable() {
        Commands commands = new Commands();
        getServer().getPluginManager().registerEvents(new Events(), this);
        getCommand("market").setExecutor(commands);
        getServer().getConsoleSender().sendMessage("Cash Plugin ON");
    }

    @Override
    public void onDisable() {
        getServer().getConsoleSender().sendMessage("Cash Plugin OFF");        
    }

    
    
}
