const express = require('express');

const router = express.Router();

const dashboardControllers = require('../controllers/dashboard');

router.post('/sites', dashboardControllers.checkUuidtable);
router.get('/sites/:email', dashboardControllers.getUuidTableData);
router.delete('/sites/:email/:uuid', dashboardControllers.deleteRowInUuidTable);

router.post('/layout', dashboardControllers.setDataAssignLayoutTable);
router.post('/layout/edit', dashboardControllers.editDataAssignLayoutTable);
router.get('/layout/:email/:uuid', dashboardControllers.getDataFromAssignLayout);
router.post('/layout/delete', dashboardControllers.deleteRowInAssignLayout);

router.get('/popups', dashboardControllers.getdata);

router.get('/script/:uuid', dashboardControllers.renderScripts);

module.exports = router;