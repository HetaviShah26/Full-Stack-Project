import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  Box,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { GreenButton, BlueButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

const ShowFollowups = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inquiries, setInquiries] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    loadData();
  }, [location.pathname]); // Reload when route changes

  const loadData = () => {
    try {
      const savedInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      const savedFollowUps = JSON.parse(localStorage.getItem('followUps') || '[]');
      setInquiries(savedInquiries);
      setFollowUps(savedFollowUps);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const deleteInquiry = (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        const updatedInquiries = inquiries.filter(inq => inq.id !== id);
        localStorage.setItem('inquiries', JSON.stringify(updatedInquiries));
        setInquiries(updatedInquiries);
      } catch (error) {
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  const deleteFollowUp = (id) => {
    if (window.confirm('Are you sure you want to delete this follow-up?')) {
      try {
        const updatedFollowUps = followUps.filter(fu => fu.id !== id);
        localStorage.setItem('followUps', JSON.stringify(updatedFollowUps));
        setFollowUps(updatedFollowUps);
      } catch (error) {
        console.error('Error deleting follow-up:', error);
      }
    }
  };

  const viewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setViewDialog(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'default',
      'contacted': 'info',
      'interested': 'warning',
      'not-interested': 'error',
      'enrolled': 'success',
      'closed': 'secondary'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const inquiryColumns = [
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'contact', label: 'Contact', minWidth: 150 },
    { id: 'programs', label: 'Programs', minWidth: 200 },
    { id: 'source', label: 'Source', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'firstContactDate', label: 'First Contact', minWidth: 150 },
    { id: 'takenBy', label: 'Taken By', minWidth: 120 },
  ];

  const inquiryRows = inquiries.map((inquiry) => {
    const programs = [];
    if (inquiry.programs?.fingerMaths) programs.push('Finger Maths');
    if (inquiry.programs?.phonics) programs.push('Phonics');
    if (inquiry.programs?.handwriting) programs.push('Handwriting');
    
    return {
      name: inquiry.name,
      contact: inquiry.contact,
      programs: programs.join(', ') || 'None',
      source: inquiry.source || 'N/A',
      status: inquiry.followUpDetails?.status || 'new',
      firstContactDate: formatDate(inquiry.firstContactDate),
      takenBy: inquiry.takenBy || 'N/A',
      id: inquiry.id,
      fullData: inquiry
    };
  });

  const InquiryButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => viewInquiry(row.fullData)}>
          <VisibilityIcon color="primary" />
        </IconButton>
        <IconButton onClick={() => deleteInquiry(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </>
    );
  };

  const followUpColumns = [
    { id: 'inquiryName', label: 'Inquiry Name', minWidth: 150 },
    { id: 'followUpDateTime', label: 'Follow-Up Date', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'remarks', label: 'Remarks', minWidth: 200 },
  ];

  const followUpRows = followUps.map((followUp) => {
    return {
      inquiryName: followUp.inquiryName || 'Unknown',
      followUpDateTime: formatDate(followUp.followUpDateTime),
      status: followUp.status || 'new',
      remarks: followUp.remarks || 'N/A',
      id: followUp.id,
      fullData: followUp
    };
  });

  const FollowUpButtonHaver = ({ row }) => {
    return (
      <>
        <IconButton onClick={() => deleteFollowUp(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </>
    );
  };

  const actions = [
    {
      icon: <AddIcon color="primary" />,
      name: 'Add New Inquiry',
      action: () => navigate('/Admin/followups')
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Inquiries & Follow-Ups
        </Typography>
        <GreenButton variant="contained" onClick={() => navigate('/Admin/followups')}>
          Add New Inquiry
        </GreenButton>
      </Box>

      {/* Inquiries Section */}
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Inquiries ({inquiries.length})
          </Typography>
        </Box>
        {inquiries.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="info">No inquiries found. Click "Add New Inquiry" to create one.</Alert>
          </Box>
        ) : (
          <TableTemplate
            buttonHaver={InquiryButtonHaver}
            columns={inquiryColumns}
            rows={inquiryRows}
          />
        )}
      </Paper>

      {/* Follow-Ups Section */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Follow-Ups ({followUps.length})
          </Typography>
        </Box>
        {followUps.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="info">No follow-ups found.</Alert>
          </Box>
        ) : (
          <TableTemplate
            buttonHaver={FollowUpButtonHaver}
            columns={followUpColumns}
            rows={followUpRows}
          />
        )}
      </Paper>

      <SpeedDialTemplate actions={actions} />

      {/* View Inquiry Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Inquiry Details</DialogTitle>
        <DialogContent>
          {selectedInquiry && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{selectedInquiry.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                <Typography variant="body1">{selectedInquiry.contact}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Programs</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {selectedInquiry.programs?.fingerMaths && <Chip label="Finger Maths" size="small" />}
                  {selectedInquiry.programs?.phonics && <Chip label="Phonics" size="small" />}
                  {selectedInquiry.programs?.handwriting && <Chip label="Handwriting" size="small" />}
                  {!selectedInquiry.programs?.fingerMaths && !selectedInquiry.programs?.phonics && !selectedInquiry.programs?.handwriting && (
                    <Typography variant="body2" color="text.secondary">None selected</Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Discussion</Typography>
                <Typography variant="body1">{selectedInquiry.discussion || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Source</Typography>
                <Typography variant="body1">{selectedInquiry.source || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Taken By</Typography>
                <Typography variant="body1">{selectedInquiry.takenBy || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">First Contact Date</Typography>
                <Typography variant="body1">{formatDate(selectedInquiry.firstContactDate)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip
                  label={selectedInquiry.followUpDetails?.status || 'new'}
                  color={getStatusColor(selectedInquiry.followUpDetails?.status || 'new')}
                  size="small"
                />
              </Grid>
              {selectedInquiry.followUpDetails && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Follow-Up Details</Typography>
                  </Grid>
                  {selectedInquiry.followUpDetails.followUpDateTime && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Follow-Up Date & Time</Typography>
                      <Typography variant="body1">{formatDate(selectedInquiry.followUpDetails.followUpDateTime)}</Typography>
                    </Grid>
                  )}
                  {selectedInquiry.followUpDetails.remarks && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Remarks</Typography>
                      <Typography variant="body1">{selectedInquiry.followUpDetails.remarks}</Typography>
                    </Grid>
                  )}
                  {selectedInquiry.followUpDetails.demoStartDate && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">Demo Start Date</Typography>
                      <Typography variant="body1">{formatDate(selectedInquiry.followUpDetails.demoStartDate)}</Typography>
                    </Grid>
                  )}
                  {selectedInquiry.followUpDetails.demoEndDate && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">Demo End Date</Typography>
                      <Typography variant="body1">{formatDate(selectedInquiry.followUpDetails.demoEndDate)}</Typography>
                    </Grid>
                  )}
                  {selectedInquiry.followUpDetails.nextFollowUpDate && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">Next Follow-Up Date</Typography>
                      <Typography variant="body1">{formatDate(selectedInquiry.followUpDetails.nextFollowUpDate)}</Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowFollowups;

