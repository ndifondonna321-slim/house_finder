"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Notification = {
  id: string;
  message: string;
  link: string;
  created_at: string;
};

export default function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch initial notifications and subscribe
  useEffect(() => {
    if (!user) return; // Only fetch if logged in

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setNotifications(data);
        
        // Calculate unread based on local storage timestamp tracking
        const lastRead = localStorage.getItem(`lastRead_${user.id}`);
        if (lastRead) {
          const unread = data.filter(n => new Date(n.created_at) > new Date(lastRead));
          setUnreadCount(unread.length);
        } else {
          setUnreadCount(data.length);
        }
      }
    };

    fetchNotifications();

    // Subscribe to new notifications in real-time
    const channel = supabase.channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev].slice(0, 5));
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length > 0) {
      setUnreadCount(0);
      localStorage.setItem(`lastRead_${user?.id}`, notifications[0].created_at);
    }
  };

  const handleNotificationClick = (link: string) => {
    setIsOpen(false);
    router.push(link);
  };

  if (!user) return null; // Don't show for guests

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button 
        onClick={handleOpen}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text)",
          fontSize: "1.2rem",
          cursor: "pointer",
          position: "relative",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            background: "#ef4444",
            color: "white",
            fontSize: "0.65rem",
            fontWeight: "bold",
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--bg-body)",
            pointerEvents: "none"
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: "-10px",
          width: "320px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          zIndex: 50,
          overflow: "hidden",
          marginTop: "0.5rem",
          animation: "fadeInDown 0.2s ease both"
        }}>
          <div style={{
            padding: "1rem",
            borderBottom: "1px solid var(--border)",
            fontWeight: 600,
            fontSize: "0.95rem"
          }}>
            Global Notifications
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                No recent notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => handleNotificationClick(n.link)}
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid var(--border-light)",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-elevated)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <p style={{ fontSize: "0.85rem", color: "var(--text)", margin: 0, lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--primary)", margin: "0.35rem 0 0 0" }}>
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
