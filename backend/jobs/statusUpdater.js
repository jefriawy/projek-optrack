// backend/jobs/statusUpdater.js
const pool = require("../config/database");

const APP_TZ = process.env.APP_TZ || "+07:00"; // set default WIB

async function updateTrainingStatuses(conn) {
  await conn.query("SET time_zone = ?", [APP_TZ]); // ⬅️ penting!

  await conn.query(
    `UPDATE training
       SET statusTraining = 'Finished'
     WHERE endTraining IS NOT NULL
       AND NOW() > endTraining
       AND statusTraining <> 'Finished'`
  );

  await conn.query(
    `UPDATE training
       SET statusTraining = 'On Progress'
     WHERE startTraining IS NOT NULL
       AND NOW() >= startTraining
       AND (endTraining IS NULL OR NOW() <= endTraining)
       AND statusTraining <> 'On Progress'`
  );

  await conn.query(
    `UPDATE training
       SET statusTraining = 'Pending'
     WHERE (startTraining IS NULL OR NOW() < startTraining)
       AND statusTraining <> 'Pending'`
  );
}

async function updateProjectStatuses(conn) {
  await conn.query("SET time_zone = ?", [APP_TZ]); // ⬅️ penting!

  await conn.query(
    `UPDATE project
       SET statusProject = 'Finished'
     WHERE endProject IS NOT NULL
       AND NOW() > endProject
       AND statusProject <> 'Finished'`
  );

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
  setInterval(tick, 3 * 1000);
}

module.exports = { startStatusScheduler };
