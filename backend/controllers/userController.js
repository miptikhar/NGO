// user controller 
const User = require('../models/User');
const MemberInfo = require('../models/Member_Info');
const Project = require('../models/Projects');

// New function to count users with role 'user'
const countUsersWithRoleUser = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'user' });
    const humanitarianRecords = await Project.find({ type: 'Humanitarian' });
    const developmentRecords = await Project.find({ type: 'Development' });

    const humanitarianCount = humanitarianRecords.length;
    const developmentCount = developmentRecords.length;

    // Calculate total_target_benef for humanitarian and development projects
    const totalTargetBenef = humanitarianRecords.reduce((sum, record) => sum + record.beneficiaries.total_target_benef, 0) +
      developmentRecords.reduce((sum, record) => sum + record.beneficiaries.total_target_benef, 0);

    console.log(humanitarianCount, developmentCount, totalTargetBenef);

    res.status(200).json({ count, humanitarianCount, developmentCount, totalTargetBenef });
  } catch (error) {
    res.status(500).json({ message: 'Error counting users', error });
  }
};

// New function to create a project
const createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectData = req.body;
    console.log(projectData);
    projectData.user = userId;

    // Create the beneficiaries object from the root-level fields
    projectData.beneficiaries = {
      total_target_benef: Number(projectData.total_target_benef) || 0,
      menAbove18: Number(projectData.men_benef) || 0,
      womenAbove18: Number(projectData.women_benef) || 0,
      childrenBelow18: Number(projectData.children_benef) || 0,
      disable_beneficiaries: Number(projectData.disable_benef) || 0,
      transgender_beneficiaries: Number(projectData.transgender_benef) || 0,
      refugee_beneficiaries: Number(projectData.refugee_benef) || 0,
      displaced_beneficiaries: Number(projectData.displaced_benef) || 0
    };


    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
};

// New function to get all projects for the authenticated user
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ user: userId });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

const getProjectById = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;
    console.log(projectId);
    console.log(userId);

    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
}; 

const addMemberInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingMemberInfo = await MemberInfo.findOne({ user: userId });
    if (existingMemberInfo) {
      return res.status(400).json({ message: 'Member info already exists for this user' });
    }

    const { name, email, description } = req.body;

    const memberInfo = new MemberInfo({ name, email, description, user: userId });
    await memberInfo.save();
    res.status(201).json(memberInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding member info', error });
  }
};

const getMemberInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const memberInfo = await MemberInfo.findOne({ user: userId });
    res.status(200).json(memberInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error getting member info', error });
  }
};

const getAllProjects = async (req, res) => {
  try {
    // Use populate to get the username from the User model
    const projects = await Project.find()
      .populate('user', 'username') // This will populate only the username field from the user document
      .exec();
    
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error getting all projects', error });
  } 
};

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Project.distinct('organizations');

    // Fetch users with role 'user'
    const users = await User.find({ role: 'user' }).select('id username');

    res.status(200).json({ organizations, users });
  } catch (error) {
    res.status(500).json({ message: 'Error getting all organizations', error });
  }
};

const filterProjects = async (req, res) => {
  const { type, sdg, year, user, province, district, beneficiaries, status, ProjectYear, sector_sdg } = req.body;

  console.log(req.body);

  let query = {};

  // If field value is "All" (case-insensitive) or empty, skip filtering for that field.
  if (type && type.trim() !== "" && type.trim().toLowerCase() !== "all") {
    query.type = { $regex: new RegExp(`^${type}$`, 'i') };
  }
  if (sdg && sdg.trim() !== "" && sdg.trim().toLowerCase() !== "all") {
    const sdgArray = sdg.split(',').map(item => item.trim()).filter(item => item);
    query.sdg = { $in: sdgArray };
  }
  if (year && year.trim() !== "" && year.trim().toLowerCase() !== "all") {
    const yearArray = year.split(',').map(item => Number(item.trim())).filter(item => !isNaN(item));
    query.year = { $in: yearArray };
  }
  if (province && province.trim() !== "" && province.trim().toLowerCase() !== "all") {
    const provinceArray = province.split(',').map(item => item.trim()).filter(item => item);
    query.province = { $in: provinceArray };
  }
  if (district && district.trim() !== "" && district.trim().toLowerCase() !== "all") {
    const districtArray = district.split(',').map(item => item.trim()).filter(item => item);
    query.district = { $in: districtArray };
  }
  if (user && Array.isArray(user) && user.length > 0 && !(user.length === 1 && user[0].toLowerCase() === "all")) {
    query.user = { $in: user };
  }
  if (sector_sdg && sector_sdg.trim() !== "" && sector_sdg.trim().toLowerCase() !== "all") {
    const humanitarianSdgArray = sector_sdg.split(',').map(item => item.trim()).filter(item => item);
    query.sector_sdg = { $in: humanitarianSdgArray };
  }


  try {
    const projects = await Project.find(query).populate('user');

    const projectsWithUsernames = projects.map(project => ({
      ...project.toObject(),
      user: project.user ? project.user.username : null,
      sdg: project.sdg.length > 0 ? project.sdg[0] : null,
      sector_sdg: project.sector_sdg.length > 0 ? project.sector_sdg[0] : null,
      province: project.province.length > 0 ? project.province[0] : null,
      district: project.district.length > 0 ? project.district[0] : null
    }));

    res.status(200).json(projectsWithUsernames);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering projects', error });
  }
};

const userFilterProjects = async (req, res) => {
  // Destructure only the 7 fields from the request body
  const { type, sdg, year, user, province, district, sector_sdg } = req.body;
  console.log(req.body);

  let query = {};

  // Filter by type if provided and not "All"
  if (type && type.trim().toLowerCase() !== "all") {
    query.type = { $regex: new RegExp(`^${type}$`, 'i') };
  }
  
  // Filter by sdg if provided and not "All"
  if (sdg && sdg.trim().toLowerCase() !== "all") {
    const sdgArray = sdg.split(',').map(item => item.trim()).filter(item => item);
    query.sdg = { $in: sdgArray };
  }
  
  // Filter by year if provided and not "All"
  if (year && year.trim().toLowerCase() !== "all") {
    const yearArray = year.split(',').map(item => Number(item.trim())).filter(item => !isNaN(item));
    query.year = { $in: yearArray };
  }
  
  // Filter by province if provided and not "All"
  if (province && province.trim().toLowerCase() !== "all") {
    const provinceArray = province.split(',').map(item => item.trim()).filter(item => item);
    query.province = { $in: provinceArray };
  }
  
  // Filter by district if provided and not "All"
  if (district && district.trim().toLowerCase() !== "all") {
    const districtArray = district.split(',').map(item => item.trim()).filter(item => item);
    query.district = { $in: districtArray };
  }
  
  // Filter by sector_sdg if provided and not "All"
  if (sector_sdg && sector_sdg.trim().toLowerCase() !== "all") {
    const sectorSdgArray = sector_sdg.split(',').map(item => item.trim()).filter(item => item);
    query.sector_sdg = { $in: sectorSdgArray };
  }
  
  // Filter by user exactly (assumes a single ID string is sent)
  if (user && user.trim() !== "") {
    query.user = user.trim();
  }

  try {
    const projects = await Project.find(query).populate('user');

    const projectsWithUsernames = projects.map(project => ({
      ...project.toObject(),
      user: project.user ? project.user.username : null, // Replace user ID with username
      sdg: project.sdg.length > 0 ? project.sdg[0] : null, // Convert sdg array to string (if needed)
      sector_sdg: project.sector_sdg.length > 0 ? project.sector_sdg[0] : null, // Convert sector_sdg array to string
      province: project.province.length > 0 ? project.province[0] : null, // Convert province array to string
      district: project.district.length > 0 ? project.district[0] : null // Convert district array to string
    }));

    res.status(200).json(projectsWithUsernames);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering projects', error });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
};




module.exports = {
  countUsersWithRoleUser,
  addMemberInfo,
  getMemberInfo,
  createProject,
  getProjects,
  getProjectById,
  getAllProjects,
  filterProjects,
  getAllOrganizations,
  userFilterProjects,
  deleteProject
}; 