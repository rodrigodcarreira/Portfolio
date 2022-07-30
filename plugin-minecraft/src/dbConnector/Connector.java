package dbConnector;

import Classes.User;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.PreparedStatement;

/**
 *
 * @author rodrigodcarreira
 */
public class Connector {

    private String jbdcURL = "jdbc:sqlite:/C:\\SQLite\\data.db";

    public Connector() {
    }

    public User RegistUser(String name) {
        Connection conn = null;
        PreparedStatement pstm = null;
        String sql = "INSERT INTO users(name, coins) VALUES(?,?);";

        try {
            conn = this.connect();
            pstm = conn.prepareStatement(sql);
            pstm.setString(1, name);
            pstm.setInt(2, 0);

            pstm.executeUpdate();
            return new User(0, name, 0, true);
        } catch (Exception e) {

        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (pstm != null) {
                try {
                    pstm.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public User getUser(String name) {
        Connection conn = null;
        Statement stm = null;
        ResultSet rs = null;
        try {
            conn = connect();
            stm = conn.createStatement();
            rs = stm.executeQuery("SELECT * FROM users WHERE name like '" + name + "';");
            while (rs.next()) {
                return new User(rs.getInt("id"), name, rs.getInt("coins"), false);
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
            return null;
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (stm != null) {
                try {
                    stm.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public boolean addCoins(String name, int coins) {
        Connection conn = null;
        PreparedStatement pstm = null;
        String sql = "UPDATE users SET coins = coins + ? WHERE name like ?;";

        try {
            conn = this.connect();
            pstm = conn.prepareStatement(sql);
            pstm.setInt(1, coins);
            pstm.setString(2, name);
            pstm.executeUpdate();
            return true;
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (pstm != null) {
                try {
                    pstm.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    private Connection connect() {
        try {
            Connection conn = DriverManager.getConnection(jbdcURL);
            return conn;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
