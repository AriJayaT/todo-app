import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { 
  collection, 
  query, 
  where, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc,
  serverTimestamp, 
  onSnapshot
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, authLoading] = useAuthState(auth);

  // Fetch tasks from Firestore with real-time updates
  useEffect(() => {
    let unsubscribe = null;

    const setupTaskListener = async () => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Setting up real-time listener for user:", user.uid);
        
        // Simplified query without orderBy to avoid needing an index
        const tasksQuery = query(
          collection(db, "tasks"),
          where("userId", "==", user.uid)
        );
        
        // Use onSnapshot for real-time updates
        unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
          // Sort manually in JavaScript instead of using orderBy in Firestore
          const taskList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })).sort((a, b) => {
            // Sort by createdAt in descending order (newest first)
            const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
            return dateB - dateA;
          });
          
          console.log("Real-time update received, tasks:", taskList);
          setTasks(taskList);
          setLoading(false);
        }, (error) => {
          console.error("Error in real-time listener:", error);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up task listener: ", error);
        setLoading(false);
      }
    };

    if (!authLoading) {
      setupTaskListener();
    }
    
    // Cleanup function to unsubscribe from the listener
    return () => {
      if (unsubscribe) {
        console.log("Unsubscribing from real-time listener");
        unsubscribe();
      }
    };
  }, [user, authLoading]);

  // Add a task to Firestore
  const addTask = async (taskText) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, "tasks"), {
        text: taskText,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  // Delete a task from Firestore
  const deleteTask = async (id) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  // Toggle task completion status in Firestore
  const toggleTask = async (id) => {
    if (!user) return;
    
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;
    
    try {
      await updateDoc(doc(db, "tasks", id), {
        completed: !taskToToggle.completed
      });
    } catch (error) {
      console.error("Error toggling task: ", error);
    }
  };

  // Update task text in Firestore
  const updateTask = async (id, newText) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, "tasks", id), {
        text: newText
      });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  return { tasks, loading, addTask, deleteTask, toggleTask, updateTask };
}