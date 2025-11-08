import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';

const AddFollowup = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  
  // Inquiry Information State
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [fingerMaths, setFingerMaths] = useState(false);
  const [phonics, setPhonics] = useState(false);
  const [handwriting, setHandwriting] = useState(false);
  const [discussion, setDiscussion] = useState('');
  const [source, setSource] = useState('');
  const [takenBy, setTakenBy] = useState('');
  const [firstContactDate, setFirstContactDate] = useState(new Date().toISOString().split('T')[0]);

  // Follow-Up Details State
  const [followUpDateTime, setFollowUpDateTime] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('new');
  const [demoStartDate, setDemoStartDate] = useState('');
  const [demoEndDate, setDemoEndDate] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Auto-fill taken by with current user's name
  useEffect(() => {
    if (currentUser && currentUser.name) {
      setTakenBy(currentUser.name);
    }
  }, [currentUser]);

  const sourceOptions = [
    'Website',
    'Social Media',
    'Referral',
    'Walk-in',
    'Phone Call',
    'Email',
    'Other'
  ];

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'interested', label: 'Interested' },
    { value: 'not-interested', label: 'Not Interested' },
    { value: 'enrolled', label: 'Enrolled' },
    { value: 'closed', label: 'Closed' }
  ];

  const handleSaveInquiry = async (e) => {
    e.preventDefault();
    
    if (!name || !contact) {
      setAlertMessage('Please fill in Name and Contact fields');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    setLoader(true);

    // Since this is frontend-only, we'll simulate saving
    const inquiryData = {
      name,
      contact,
      programs: {
        fingerMaths,
        phonics,
        handwriting
      },
      discussion,
      source,
      takenBy,
      firstContactDate,
      followUpDetails: (followUpDateTime || remarks || status !== 'new' || demoStartDate || demoEndDate || nextFollowUpDate) ? {
        followUpDateTime,
        remarks,
        status,
        demoStartDate,
        demoEndDate,
        nextFollowUpDate
      } : null,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage for frontend-only demo
    try {
      const existingInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      existingInquiries.push({
        ...inquiryData,
        id: Date.now().toString()
      });
      localStorage.setItem('inquiries', JSON.stringify(existingInquiries));
      
      setAlertMessage('Inquiry saved successfully!');
      setAlertType('success');
      setShowAlert(true);
      
      // Navigate to list page after 1 second
      setTimeout(() => {
        navigate('/Admin/followups/list');
      }, 1000);
    } catch (error) {
      setAlertMessage('Error saving inquiry. Please try again.');
      setAlertType('error');
      setShowAlert(true);
      setLoader(false);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    
    if (!followUpDateTime || !remarks) {
      setAlertMessage('Please fill in Follow-Up Date & Time and Remarks');
      setAlertType('error');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    setLoader(true);

    // Since this is frontend-only, we'll simulate adding follow-up
    const followUpData = {
      followUpDateTime,
      remarks,
      status,
      demoStartDate,
      demoEndDate,
      nextFollowUpDate,
      addedAt: new Date().toISOString()
    };

    // Save to localStorage for frontend-only demo
    try {
      const existingFollowUps = JSON.parse(localStorage.getItem('followUps') || '[]');
      existingFollowUps.push({
        ...followUpData,
        id: Date.now().toString(),
        inquiryName: name || 'Unknown'
      });
      localStorage.setItem('followUps', JSON.stringify(existingFollowUps));
      
      setAlertMessage('Follow-up added successfully!');
      setAlertType('success');
      setShowAlert(true);
      
      // Navigate to list page after 1 second
      setTimeout(() => {
        navigate('/Admin/followups/list');
      }, 1000);
    } catch (error) {
      setAlertMessage('Error adding follow-up. Please try again.');
      setAlertType('error');
      setShowAlert(true);
      setLoader(false);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const resetForm = () => {
    setName('');
    setContact('');
    setFingerMaths(false);
    setPhonics(false);
    setHandwriting(false);
    setDiscussion('');
    setSource('');
    setTakenBy(currentUser?.name || '');
    setFirstContactDate(new Date().toISOString().split('T')[0]);
    setFollowUpDateTime('');
    setRemarks('');
    setStatus('new');
    setDemoStartDate('');
    setDemoEndDate('');
    setNextFollowUpDate('');
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Inquiry & Follow-Up Management
      </Typography>

      {showAlert && (
        <Alert severity={alertType} sx={{ mb: 3 }} onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <form>
          {/* Inquiry Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              🧍 Inquiry Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  variant="outlined"
                  placeholder="Phone number or email"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Program:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={fingerMaths}
                        onChange={(e) => setFingerMaths(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Finger Maths"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={phonics}
                        onChange={(e) => setPhonics(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Phonics"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={handwriting}
                        onChange={(e) => setHandwriting(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Handwriting"
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Discussion"
                  value={discussion}
                  onChange={(e) => setDiscussion(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Enter discussion details..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={source}
                    label="Source"
                    onChange={(e) => setSource(e.target.value)}
                  >
                    {sourceOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Taken by"
                  value={takenBy}
                  onChange={(e) => setTakenBy(e.target.value)}
                  variant="outlined"
                  placeholder="Auto-filled with current user"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Contact Date"
                  type="date"
                  value={firstContactDate}
                  onChange={(e) => setFirstContactDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Follow-Up Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              📞 Follow-Up Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Follow-Up Date & Time"
                  type="datetime-local"
                  value={followUpDateTime}
                  onChange={(e) => setFollowUpDateTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Enter remarks..."
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Demo Start Date"
                  type="date"
                  value={demoStartDate}
                  onChange={(e) => setDemoStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Demo End Date"
                  type="date"
                  value={demoEndDate}
                  onChange={(e) => setDemoEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Next Follow-Up Date"
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4, alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/Admin/followups/list')}
            >
              View All Inquiries
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSaveInquiry}
                disabled={loader}
                sx={{ minWidth: 150 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  '✅ Save Inquiry'
                )}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleAddFollowUp}
                disabled={loader}
                sx={{ minWidth: 150 }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  '✅ Add Follow-Up'
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddFollowup;

