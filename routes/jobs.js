const express = require('express');
const router = express.Router();
const {
    getAllJobListing,
    getSingleJobListing,
    createJobListing,
    editJobListing,
    deleteJobListing
} = require('../controllers/jobs');


router.route('/').get(getAllJobListing).post(createJobListing);
router.route('/:id').get(getSingleJobListing).put(editJobListing).delete(deleteJobListing);


module.exports = router;