import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const counterRef = doc(db, 'meta', 'counter')

export async function getNextOrderId() {
  const snap = await getDoc(counterRef)
  if (!snap.exists()) {
    await setDoc(counterRef, { orderCount: 1 })
    return 1
  }

  const current = snap.data().orderCount ?? 0
  const next = current + 1
  await updateDoc(counterRef, { orderCount: next })
  return next
}

export async function resetOrderCounter() {
  await setDoc(counterRef, { orderCount: 0 })
}
