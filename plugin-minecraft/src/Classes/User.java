package Classes;

/**
 *
 * @author rodrigodcarreira
 */
public class User {
    
    private int id;
    private String name;
    private int coins;
    private boolean first;

    public User(int id, String name, int coins,boolean first) {
        this.id = id;
        this.name = name;
        this.coins = coins;
        this.first = first;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCoins() {
        return coins;
    }

    public void setCoins(int coins) {
        this.coins = coins;
    }

    public boolean isFirst() {
        return first;
    }

    public void setFirst(boolean first) {
        this.first = first;
    }
    
    
    
    
}
