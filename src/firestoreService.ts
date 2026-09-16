import { db, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from './firebase';
import { Task, Program, Meeting, Birthday } from './types';

// Collection names in Firestore
const TASKS_COLL = 'tasks';
const PROGRAMS_COLL = 'programs';
const MEETINGS_COLL = 'meetings';
const BIRTHDAYS_COLL = 'birthdays';

/**
 * Real-time listener for tasks collection
 */
export function subscribeToTasks(onUpdate: (tasks: Task[]) => void) {
  try {
    const collRef = collection(db, TASKS_COLL);
    return onSnapshot(
      collRef,
      (snapshot) => {
        const items: Task[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Task);
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      },
      (error) => {
        console.warn('Firestore tasks snapshot listener warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore tasks subscription failed:', err);
    return () => {};
  }
}

function cleanForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Save single task to Firestore
 */
export async function syncTaskToFirestore(task: Task) {
  try {
    const docRef = doc(db, TASKS_COLL, task.id);
    await setDoc(docRef, cleanForFirestore(task), { merge: true });
  } catch (err) {
    console.warn('Failed to sync task to Firestore:', err);
  }
}

/**
 * Delete task from Firestore
 */
export async function deleteTaskFromFirestore(taskId: string) {
  try {
    const docRef = doc(db, TASKS_COLL, taskId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete task from Firestore:', err);
  }
}

/**
 * Real-time listener for programs collection
 */
export function subscribeToPrograms(onUpdate: (programs: Program[]) => void) {
  try {
    const collRef = collection(db, PROGRAMS_COLL);
    return onSnapshot(
      collRef,
      (snapshot) => {
        const items: Program[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Program);
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      },
      (error) => {
        console.warn('Firestore programs snapshot listener warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore programs subscription failed:', err);
    return () => {};
  }
}

export async function syncProgramToFirestore(program: Program) {
  try {
    const docRef = doc(db, PROGRAMS_COLL, program.id);
    await setDoc(docRef, program, { merge: true });
  } catch (err) {
    console.warn('Failed to sync program to Firestore:', err);
  }
}

export async function deleteProgramFromFirestore(programId: string) {
  try {
    const docRef = doc(db, PROGRAMS_COLL, programId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete program from Firestore:', err);
  }
}

/**
 * Real-time listener for meetings collection
 */
export function subscribeToMeetings(onUpdate: (meetings: Meeting[]) => void) {
  try {
    const collRef = collection(db, MEETINGS_COLL);
    return onSnapshot(
      collRef,
      (snapshot) => {
        const items: Meeting[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Meeting);
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      },
      (error) => {
        console.warn('Firestore meetings snapshot listener warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore meetings subscription failed:', err);
    return () => {};
  }
}

export async function syncMeetingToFirestore(meeting: Meeting) {
  try {
    const docRef = doc(db, MEETINGS_COLL, meeting.id);
    await setDoc(docRef, meeting, { merge: true });
  } catch (err) {
    console.warn('Failed to sync meeting to Firestore:', err);
  }
}

export async function deleteMeetingFromFirestore(meetingId: string) {
  try {
    const docRef = doc(db, MEETINGS_COLL, meetingId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete meeting from Firestore:', err);
  }
}

/**
 * Real-time listener for birthdays collection
 */
export function subscribeToBirthdays(onUpdate: (birthdays: Birthday[]) => void) {
  try {
    const collRef = collection(db, BIRTHDAYS_COLL);
    return onSnapshot(
      collRef,
      (snapshot) => {
        const items: Birthday[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Birthday);
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      },
      (error) => {
        console.warn('Firestore birthdays snapshot listener warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore birthdays subscription failed:', err);
    return () => {};
  }
}

export async function syncBirthdayToFirestore(birthday: Birthday) {
  try {
    const docRef = doc(db, BIRTHDAYS_COLL, birthday.id);
    await setDoc(docRef, birthday, { merge: true });
  } catch (err) {
    console.warn('Failed to sync birthday to Firestore:', err);
  }
}

export async function deleteBirthdayFromFirestore(birthdayId: string) {
  try {
    const docRef = doc(db, BIRTHDAYS_COLL, birthdayId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete birthday from Firestore:', err);
  }
}

/**
 * Test connectivity to Firestore
 */
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const testDocRef = doc(db, '_connection_test', 'status');
    await setDoc(testDocRef, {
      connected: true,
      timestamp: new Date().toISOString(),
      appName: 'Follow Up System',
      project: 'followup-55110',
    });
    return { success: true, message: 'Connected to Firestore successfully (followup-55110)' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Firestore connection check failed' };
  }
}

/**
 * Bulk sync all local workspace data into Firestore
 */
export async function syncAllDataToFirestore(
  tasks: Task[],
  programs: Program[],
  meetings: Meeting[],
  birthdays: Birthday[]
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    let syncedCount = 0;
    // Sync tasks
    for (const t of tasks) {
      await syncTaskToFirestore(t);
      syncedCount++;
    }
    // Sync programs
    for (const p of programs) {
      await syncProgramToFirestore(p);
      syncedCount++;
    }
    // Sync meetings
    for (const m of meetings) {
      await syncMeetingToFirestore(m);
      syncedCount++;
    }
    // Sync birthdays
    for (const b of birthdays) {
      await syncBirthdayToFirestore(b);
      syncedCount++;
    }

    // Record sync timestamp
    const metaDocRef = doc(db, '_settings', 'last_sync');
    await setDoc(metaDocRef, {
      syncedAt: new Date().toISOString(),
      totalRecords: syncedCount,
    });

    return { success: true, count: syncedCount };
  } catch (err: any) {
    console.error('Bulk sync to Firestore failed:', err);
    return { success: false, count: 0, error: err?.message || 'Sync failed' };
  }
}
