package commands;

import java.util.Arrays;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.SkullType;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.event.inventory.InventoryType;
import org.bukkit.inventory.Inventory;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.inventory.meta.SkullMeta;
import org.bukkit.profile.PlayerProfile;

/**
 *
 * @author rodrigodcarreira
 */
public class Commands implements CommandExecutor {

    @Override
    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args) {
        if (!(sender instanceof Player)) {
            return true;
        }

        Player player = (Player) sender;

        switch (cmd.getName().toLowerCase()) {
            case "market" -> {
                player.sendMessage("asdasd");
                cmdMarket(player);
                return true;
            }
            default -> {
            }
        }

        return true;
    }

    private void cmdMarket(Player player) {
        Inventory inv = Bukkit.createInventory(null, 54, "Market");
        for (int i = 0; i <= 53; i++) {
            if (i < 45) {
                inv.setItem(i, createItem(Material.LIME_STAINED_GLASS_PANE, "Open a Market", "Click on a head to open a market"));
            } else {
                inv.setItem(i, createItem(Material.BLACK_STAINED_GLASS_PANE, "Open a Market", "Click on a head to open a market"));
            }
        }
        
        inv.setItem(45, createItem(Material.BLUE_STAINED_GLASS_PANE, "Back", ""));
        inv.setItem(49, createHead(player.getPlayerProfile()));
        inv.setItem(53, createItem(Material.BLUE_STAINED_GLASS_PANE, "Forward", ""));

        player.openInventory(inv);
    }

    protected ItemStack createItem(final Material material, final String name, final String... lore) {
        final ItemStack item = new ItemStack(material, 1);
        final ItemMeta meta = item.getItemMeta();

        // Set the name of the item
        meta.setDisplayName(name);

        // Set the lore of the item
        meta.setLore(Arrays.asList(lore));

        item.setItemMeta(meta);

        return item;
    }

    protected ItemStack createHead(PlayerProfile player) {
        String lore = player.getName();
        ItemStack skull = new ItemStack(Material.PLAYER_HEAD,1,(short) 3 );
        SkullMeta skullMeta = (SkullMeta) skull.getItemMeta();
        skullMeta.setOwnerProfile(player);
        skullMeta.setDisplayName("Market of");
        skullMeta.setLore(Arrays.asList(lore));
        skull.setItemMeta(skullMeta);
        return skull;
    }
}
