"use client";

import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Coins,
  Leaf,
  Search,
  Bell,
  User,
  ChevronDown,
  LogIn,
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import { Badge } from "./ui/badge";
import { Web3Auth } from "@web3auth/modal";

import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";

import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  createUser,
  getUnreadNotifications,
  getUserBalance,
  getUserByEmail,
  markNotificationAsRead,
} from "../../utils/db/actions";

const clientId = process.env.WEB3_AUTH_CLIENT_ID;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Sepolia Testnet",
  blockExplorer: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://assets.web3auth.oi/evm-chains/sepolia.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: chainConfig,
});
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
  privateKeyProvider,
});

interface HeaderProps {
  onMenuClick: () => void;
  totalEarnings: number;
}

export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
  const [provider, setProvider] = useState<IProvider | null>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>();
  const pathname = usePathname();
  const [notification, setNotification] = useState<Notification[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setIsLoggedIn(true);
          const user = await web3auth.getUserInfo();
          setUserInfo(user);
          if (user.email) {
            localStorage.setItem("email", user.email);
            try {
              await createUser(user.email ?? "", user.name || "Anonymous User");
            } catch (error) {
              console.error("Error creating user:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing web3auth", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userInfo && userInfo.email) {
        const user = await getUserByEmail(userInfo.email);
        if (user) {
          const unreadNotifications = await getUnreadNotifications(user[0].id);
          setNotification(unreadNotifications);
        }
      }
    };
    fetchNotifications();
    const notificationInterval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(notificationInterval);
  }, [userInfo]);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (userInfo && userInfo.email) {
        const user = await getUserByEmail(userInfo.email);
        if (user) {
          const userBalance = getUserBalance(user[0].id);
          setBalance(userBalance);
        }
      }
    };
    fetchUserBalance();
    const handleBalanceUpdate = (event: CustomEvent) => {
      setBalance(event.detail);
    };
    window.addEventListener(
      "balanceUpdate",
      handleBalanceUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "balanceUpdate",
        handleBalanceUpdate as EventListener
      );
    };
  }, [userInfo]);

  const login = async () => {
    if (!web3auth) {
      console.error("web3auth not initialized");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setIsLoggedIn(true);
      const user = await web3auth.getUserInfo();
      setUserInfo(user);
      if (user.email) {
        localStorage.setItem("email", user.email);
        try {
          await createUser(user.email ?? "", user.name || "Anonymous User");
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    } catch (error) {
      console.error("Error Loggin in", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized");
      return;
    }

try {
await web3auth.logout();
setProvider(null);
setIsLoggedIn(false);
setUserInfo(null);
localStorage.removeItem("email");
} catch (error) {
console.error("Error logging out", error);
}


  };
const  getUserInfo = async () => {
  if(web3auth.connected){
    const user = await web3auth.getUserInfo();
    setUserInfo(user);

    if (user.email){
      localStorage.setItem("email", user.email);
      try {
        await createUser(user.email ?? "", user.name || "Anonymous User");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  }
}

const handleNotificationClick = async (notificationId:number) => {
await markNotificationAsRead(notificationId);
}

if (loading) {
  return <div>Loading web3auth...</div>;
}


return (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50  ">
//TODO header content
  </header>
)

}
