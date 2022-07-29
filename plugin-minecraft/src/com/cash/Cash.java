package com.cash;

import com.cash.events.Events;
import org.bukkit.plugin.java.JavaPlugin;

/**
 *
 * @author rodrigodcarreira
 */
public class Cash extends JavaPlugin{

    @Override
    public void onEnable() {
        getServer().getPluginManager().registerEvents(new Events(), this);
        getServer().getConsoleSender().sendMessage("Cash Plugin ON");
    }

    @Override
    public void onDisable() {
        getServer().getConsoleSender().sendMessage("Cash Plugin OFF");        
    }

    
    
}
