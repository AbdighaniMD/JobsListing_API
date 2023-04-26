const jobsListing = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError } = require('../errors');

/**
 * GET /
 * Access to all the Jobs listed in the database 
 * filter / Search 
*/

const getAllJobListing = async (req, res) => {
   const listOfJobs = await jobsListing.find({ createdBy: req.user.userId }).sort('createdAt');
   res.status(StatusCodes.OK).json({listOfJobs, count: listOfJobs.length});
}

/**
 * GET /:id
 * Access to Single Jobs listed in the database 

*/
const getSingleJobListing = async (req, res) => {
    //let viewID = {_id: req.params.id, createdBy: req.user.userId }
    const {
        user: { userId },
        params: { id: jobId },
      } = req

    const findAJob = await jobsListing.findOne({
        _id: jobId,
        createdBy: userId,
    });
    if (!findAJob) {
        throw new NotFoundError(`No job with id ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({findAJob});
}

/**
 * POST /
 * Add new job listing
 * 
*/
const createJobListing = async (req, res) => {
    let addJob = new jobsListing({
        company:req.body.company,
        position:req.body.position,
        status: req.body.status,
        createdBy: req.user.userId
    });

    const job = await addJob.save();
    res.status(StatusCodes.CREATED).json({job})

}

/**
 * PUT /id
 * Add new job listing
 * 
*/
const editJobListing = async (req, res) => {
    //let viewID = {_id: req.params.id, createdBy: req.user.userId }
    const {
        user: { userId },
        params: { id: jobId },
      } = req
    
      let editItems = {
        company:req.body.company,
        position:req.body.position,
        status: req.body.status
    }

    if (editItems.company === '' || editItems.position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }

    const editjob = await jobsListing.findByIdAndUpdate({_id: jobId, createdBy: userId},editItems,{new:true, runValidators: true });
    if (!editjob) {
        throw new NotFoundError(`No job with id ${req.params.id}`)
      }
    res.status(StatusCodes.OK).json({editjob});
}

/**
 * delete /id
 * Add new job listing
 * 
*/
const deleteJobListing = async (req, res) => {
    //let viewID = {_id: req.params.id, createdBy: req.user.userId }
    const {
        user: { userId },
        params: { id: jobId },
      } = req
    const deletedJob = await jobsListing.findByIdAndRemove({
        _id: jobId,
        createdBy: userId
    });
    //console.log(user);
    if (!deletedJob) {
        throw new NotFoundError(`No job with id ${req.params.id}`)
      }
      res.status(StatusCodes.OK).send('successfully deleted job');
}

module.exports  = {
    getAllJobListing,
    getSingleJobListing,
    createJobListing,
    editJobListing,
    deleteJobListing
}