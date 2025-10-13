// backend/jobs/statusUpdater.js
const pool = require("../config/database");
const Notification = require("../models/notificationModel"); // Import Notif Model

const APP_TZ = process.env.APP_TZ || "+07:00";
// set default WIB

async function updateTrainingStatuses(conn) {
  await conn.query("SET time_zone = ?", [APP_TZ]); // ⬅️ penting!

  // --- LOGIKA NOTIFIKASI DAN UPDATE STATUS TRAINING FINISHED (DELIVERED) ---

  // 1. Ambil training yang akan diselesaikan DAN belum berstatus 'Training Delivered'
  const [finishedTrainings] = await conn.query(
    `SELECT tr.idTraining, tr.nmTraining, tr.idExpert
     FROM training tr
     WHERE endTraining IS NOT NULL
       AND NOW() > endTraining
       AND statusTraining <> 'Training Delivered'`
  );

  // 2. Update status training menjadi 'Training Delivered'
  await conn.query(
    `UPDATE training
       SET statusTraining = 'Training Delivered'
     WHERE endTraining IS NOT NULL
       AND NOW() > endTraining
       AND statusTraining <> 'Training Delivered'`
  );

  // 3. NOTIFIKASI 3.B: Training Selesai -> Kirim ke Trainer (Expert)
  for (const tr of finishedTrainings) {
    if (tr.idExpert) {
      await Notification.createNotification({
        recipientId: tr.idExpert,
        recipientRole: "Expert", // Asumsi Trainer/Expert memiliki role 'Expert'
        message: `Training (${tr.nmTraining}) telah Selesai`,
        type: "training_finished",
        senderId: "SYSTEM", // Sender sistem
        senderName: "System",
        relatedEntityId: tr.idTraining,
      });
    }
  }

  // --- LOGIKA NOTIFIKASI DAN UPDATE STATUS TRAINING STARTED (ON PROGRESS) ---

  // 4. Ambil training yang akan dimulai DAN belum berstatus 'Training On Progress'
  const [startedTrainings] = await conn.query(
    `SELECT tr.idTraining, tr.nmTraining, tr.idExpert
     FROM training tr
     WHERE startTraining IS NOT NULL
       AND NOW() >= startTraining
       AND (endTraining IS NULL OR NOW() <= endTraining)
       AND statusTraining <> 'Training On Progress'`
  );

  // 5. Update status training menjadi 'Training On Progress'
  await conn.query(
    `UPDATE training
       SET statusTraining = 'Training On Progress'
     WHERE startTraining IS NOT NULL
       AND NOW() >= startTraining
       AND (endTraining IS NULL OR NOW() <= endTraining)
       AND statusTraining <> 'Training On Progress'`
  );

  // 6. NOTIFIKASI 3.A: Training Dimulai -> Kirim ke Trainer (Expert)
  for (const tr of startedTrainings) {
    if (tr.idExpert) {
      await Notification.createNotification({
        recipientId: tr.idExpert,
        recipientRole: "Expert",
        message: `Training (${tr.nmTraining}) telah dimulai`,
        type: "training_started",
        senderId: "SYSTEM", // Sender sistem
        senderName: "System",
        relatedEntityId: tr.idTraining,
      });
    }
  }

  // --- LOGIKA UPDATE STATUS TRAINING PENDING (PO RECEIVED) ---

  // Mengganti status yang belum dimulai menjadi 'Po Received'
  await conn.query(
    `UPDATE training
       SET statusTraining = 'Po Received'
     WHERE (startTraining IS NULL OR NOW() < startTraining)
       AND statusTraining <> 'Po Received'`
  );
}

async function updateProjectStatuses(conn) {
  await conn.query("SET time_zone = ?", [APP_TZ]); // ⬅️ penting!

  // --- PERUBAHAN: Hapus atau nonaktifkan blok ini ---
  /*
  await conn.query(
    `UPDATE project
       SET statusProject = 'Finished'
     WHERE endProject IS NOT NULL
       AND NOW() > endProject
       AND statusProject <> 'Finished'`
  );
  */

  await conn.query(
    `UPDATE project
       SET statusProject = 'On Progress'
     WHERE startProject IS NOT NULL
       AND NOW() >= startProject
       AND (endProject IS NULL OR NOW() <= endProject)
       AND statusProject <> 'On Progress'`
  );
  await conn.query(
    `UPDATE project
       SET statusProject = 'Pending'
     WHERE (startProject IS NULL OR NOW() < startProject)
       AND statusProject <> 'Pending'`
  );
}

async function tick() {
  const conn = await pool.getConnection();
  try {
    await updateTrainingStatuses(conn);
    await updateProjectStatuses(conn);
  } finally {
    conn.release();
  }
}

function startStatusScheduler() {
  tick().catch(console.error);
  // Interval 3 detik seperti yang sudah ada
  setInterval(tick, 3 * 1000);
}

module.exports = { startStatusScheduler };
