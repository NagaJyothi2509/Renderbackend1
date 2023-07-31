/*const { validateContact,Contact} = require("../models/Contact");
const auth=require("../middlewares/auth");

const mongoose=require("mongoose");

const router=require("express").Router();

//create Contact
router.post("/contact",auth,async(req,res)=>{
    const {error}=validateContact(req.body);
    if(error){
        return res.status(400).json({error:error.details[0].message})

    }
    const{name,address,email,phone}=req.body;
    try{
         const newContact=new Contact({
            name,
            address,
            email,
            phone,
            postedBy:req.user._id,
         });
    const result=await newContact.save();
    return res.status(201).json({...result._doc});

    }catch(err){
        console.log(err);
    }
});

//fetch COntact

router.get("/mycontacts", auth, async (req, res) => {
    try {
      const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
        "postedBy",
        "-password"
      );
  
      return res.status(200).json({ contacts: myContacts.reverse() });
    } catch (err) {
      console.log(err);
    }
  });


//update contact
router.put("/contact", auth, async (req, res) => {
    const { id } = req.body;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
  
    try {
      const contact = await Contact.findOne({ _id: id });
  
      if (req.user._id.toString() !== contact.postedBy._id.toString())
        return res
          .status(401)
          .json({ error: "you can't edit other people contacts!" });
  
      const updatedData = { ...req.body, id: undefined };
      const result = await Contact.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
  
      return res.status(200).json({ ...result._doc });
    } catch (err) {
      console.log(err);
    }
  });
  






  //delete contact
  router.delete("/delete/:id", auth, async (req, res) => {
    const { id } = req.params;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
  
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
    try {
      const contact = await Contact.findOne({ _id: id });
      if (!contact) return res.status(400).json({ error: "no contact found" });
  
      if (req.user._id.toString() !== contact.postedBy._id.toString())
        return res
          .status(401)
          .json({ error: "you can't delete other people contacts!" });
  
      const result = await Contact.deleteOne({ _id: id });
      const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
        "postedBy",
        "-password"
      );
  
      return res
        .status(200)
        .json({ ...contact._doc, myContacts: myContacts.reverse() });
    } catch (err) {
      console.log(err);
    }
  });

//to get a single contact
router.get("/contact/:id", auth, async (req, res) => {
    const { id } = req.params;
  
    if (!id) return res.status(400).json({ error: "no id specified." });
  
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "please enter a valid id" });
  
    try {
      const contact = await Contact.findOne({ _id: id });
  
      return res.status(200).json({ ...contact._doc });
    } catch (err) {
      console.log(err);
    }
  });

module.exports=router;
*/
const { validateContact, Contact } = require("../models/Contact");
const auth = require("../middlewares/auth");

const mongoose = require("mongoose");

const router = require("express").Router();

// Create Contact
router.post("/contact", auth, async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { name, address, email, phone } = req.body;
  try {
    const newContact = new Contact({
      name,
      address,
      email,
      phone,
      postedBy: req.user._id,
    });
    const result = await newContact.save();
    return res.status(201).json({ ...result._doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch paginated contacts
router.get("/mycontacts", auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
  const limit = 5; // Number of contacts to display per page

  try {
    // Calculate the offset to skip rows on previous pages
    const skip = (page - 1) * limit;

    const totalContacts = await Contact.countDocuments({
      postedBy: req.user._id,
    });

    const totalPages = Math.ceil(totalContacts / limit);

    const myContacts = await Contact.find({ postedBy: req.user._id })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "-password");

    return res.status(200).json({
      contacts: myContacts.reverse(),
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update contact
router.put("/contact/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "No id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "Please enter a valid id" });

  try {
    const contact = await Contact.findOne({ _id: id });

    if (!contact) return res.status(400).json({ error: "No contact found" });

    if (req.user._id.toString() !== contact.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "You can't edit other people's contacts!" });

    const { name, address, email, phone } = req.body;

    const updatedData = { name, address, email, phone };

    const result = await Contact.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete contact
router.delete("/contact/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "No id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "Please enter a valid id" });

  try {
    const contact = await Contact.findOne({ _id: id });
    if (!contact) return res.status(400).json({ error: "No contact found" });

    if (req.user._id.toString() !== contact.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "You can't delete other people's contacts!" });

    await Contact.deleteOne({ _id: id });

    const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...contact._doc, myContacts: myContacts.reverse() });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a single contact
router.get("/contact/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "No id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "Please enter a valid id" });

  try {
    const contact = await Contact.findOne({ _id: id });

    return res.status(200).json({ ...contact._doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


