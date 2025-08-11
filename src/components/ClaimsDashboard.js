import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Upload
} from 'lucide-react';

const ClaimsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showDepartmentDetails, setShowDepartmentDetails] = useState(false);
  const [showMonthDetails, setShowMonthDetails] = useState(false);
  
  // Sample claims data - same as in ClaimsTable
  const sampleClaims = [
    {
      id: 'CLM001',
      patientId: 'PAT12345',
      patientName: 'John Smith',
      status: 'Pending Review',
      submissionDate: '2025-08-01',
      totalAmount: 1250.00,
      diag1: 'Z51.11',
      diag2: 'C78.00',
      diag3: null,
      udf1: 'High Priority',
      udf2: 'Oncology',
      udf3: 'Dr. Johnson',
      provider: 'City Medical Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-07',
      age: 65,
      gender: 'Male',
      department: 'Oncology'
    },
    {
      id: 'CLM002',
      patientId: 'PAT67890',
      patientName: 'Sarah Johnson',
      status: 'Approved',
      submissionDate: '2025-08-02',
      totalAmount: 850.75,
      diag1: 'M79.3',
      diag2: 'M25.511',
      diag3: 'Z87.891',
      udf1: 'Standard',
      udf2: 'Orthopedic',
      udf3: 'Dr. Smith',
      provider: 'Wellness Clinic',
      insuranceType: 'Private',
      lastUpdated: '2025-08-06',
      age: 42,
      gender: 'Female',
      department: 'Orthopedic'
    },
    {
      id: 'CLM003',
      patientId: 'PAT11111',
      patientName: 'Michael Brown',
      status: 'Denied',
      submissionDate: '2025-08-03',
      totalAmount: 2100.50,
      diag1: 'I25.10',
      diag2: 'E11.9',
      diag3: 'Z95.1',
      udf1: 'Rush',
      udf2: 'Cardiology',
      udf3: 'Dr. Wilson',
      provider: 'Heart Institute',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-05',
      age: 58,
      gender: 'Male',
      department: 'Cardiology'
    },
    {
      id: 'CLM004',
      patientId: 'PAT22222',
      patientName: 'Emily Davis',
      status: 'In Progress',
      submissionDate: '2025-08-04',
      totalAmount: 675.25,
      diag1: 'N39.0',
      diag2: null,
      diag3: null,
      udf1: 'Standard',
      udf2: 'Urology',
      udf3: 'Dr. Brown',
      provider: 'Specialty Care',
      insuranceType: 'Private',
      lastUpdated: '2025-08-08',
      age: 35,
      gender: 'Female',
      department: 'Urology'
    },
    {
      id: 'CLM005',
      patientId: 'PAT33333',
      patientName: 'Robert Wilson',
      status: 'Approved',
      submissionDate: '2025-08-05',
      totalAmount: 1450.00,
      diag1: 'F32.9',
      diag2: 'Z91.19',
      diag3: null,
      udf1: 'High Priority',
      udf2: 'Psychiatry',
      udf3: 'Dr. Lee',
      provider: 'Mental Health Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-07',
      age: 72,
      gender: 'Male',
      department: 'Psychiatry'
    },
    {
      id: 'CLM006',
      patientId: 'PAT44444',
      patientName: 'Lisa Anderson',
      status: 'Pending Review',
      submissionDate: '2025-08-06',
      totalAmount: 925.80,
      diag1: 'O80.1',
      diag2: 'Z37.0',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Obstetrics',
      udf3: 'Dr. Martinez',
      provider: 'Women\'s Hospital',
      insuranceType: 'Private',
      lastUpdated: '2025-08-08',
      age: 28,
      gender: 'Female',
      department: 'Obstetrics'
    },
    {
      id: 'CLM007',
      patientId: 'PAT55555',
      patientName: 'David Rodriguez',
      status: 'Approved',
      submissionDate: '2025-08-07',
      totalAmount: 1875.30,
      diag1: 'J44.1',
      diag2: 'Z87.891',
      diag3: 'I10',
      udf1: 'High Priority',
      udf2: 'Pulmonology',
      udf3: 'Dr. Davis',
      provider: 'Respiratory Care Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-09',
      age: 68,
      gender: 'Male',
      department: 'Pulmonology'
    },
    {
      id: 'CLM008',
      patientId: 'PAT66666',
      patientName: 'Jennifer Garcia',
      status: 'In Progress',
      submissionDate: '2025-08-08',
      totalAmount: 1125.45,
      diag1: 'M17.12',
      diag2: 'M25.561',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Orthopedic',
      udf3: 'Dr. Thompson',
      provider: 'Joint Care Clinic',
      insuranceType: 'Private',
      lastUpdated: '2025-08-10',
      age: 55,
      gender: 'Female',
      department: 'Orthopedic'
    },
    {
      id: 'CLM009',
      patientId: 'PAT77777',
      patientName: 'James Miller',
      status: 'Denied',
      submissionDate: '2025-08-09',
      totalAmount: 2250.00,
      diag1: 'C25.9',
      diag2: 'Z51.11',
      diag3: 'K92.2',
      udf1: 'Rush',
      udf2: 'Oncology',
      udf3: 'Dr. Anderson',
      provider: 'Cancer Treatment Center',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-11',
      age: 62,
      gender: 'Male',
      department: 'Oncology'
    },
    {
      id: 'CLM010',
      patientId: 'PAT88888',
      patientName: 'Maria Lopez',
      status: 'Pending Review',
      submissionDate: '2025-08-10',
      totalAmount: 750.90,
      diag1: 'N18.6',
      diag2: 'E11.22',
      diag3: 'I12.9',
      udf1: 'High Priority',
      udf2: 'Nephrology',
      udf3: 'Dr. Kim',
      provider: 'Kidney Care Institute',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-11',
      age: 71,
      gender: 'Female',
      department: 'Nephrology'
    },
    {
      id: 'CLM011',
      patientId: 'PAT99999',
      patientName: 'Christopher Lee',
      status: 'Approved',
      submissionDate: '2025-08-11',
      totalAmount: 1650.75,
      diag1: 'S72.001A',
      diag2: 'W19.XXXA',
      diag3: null,
      udf1: 'Rush',
      udf2: 'Emergency',
      udf3: 'Dr. White',
      provider: 'Emergency Medical Center',
      insuranceType: 'Private',
      lastUpdated: '2025-08-11',
      age: 45,
      gender: 'Male',
      department: 'Emergency'
    },
    {
      id: 'CLM012',
      patientId: 'PAT10001',
      patientName: 'Amanda Taylor',
      status: 'In Progress',
      submissionDate: '2025-07-25',
      totalAmount: 980.25,
      diag1: 'G93.1',
      diag2: 'S06.2X1A',
      diag3: 'Z87.820',
      udf1: 'High Priority',
      udf2: 'Neurology',
      udf3: 'Dr. Roberts',
      provider: 'Neurological Institute',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-05',
      age: 67,
      gender: 'Female',
      department: 'Neurology'
    },
    {
      id: 'CLM013',
      patientId: 'PAT10002',
      patientName: 'Thomas Clark',
      status: 'Approved',
      submissionDate: '2025-07-28',
      totalAmount: 1320.60,
      diag1: 'I48.91',
      diag2: 'I50.9',
      diag3: 'Z95.0',
      udf1: 'Standard',
      udf2: 'Cardiology',
      udf3: 'Dr. Johnson',
      provider: 'Heart Specialists',
      insuranceType: 'Private',
      lastUpdated: '2025-08-03',
      age: 59,
      gender: 'Male',
      department: 'Cardiology'
    },
    {
      id: 'CLM014',
      patientId: 'PAT10003',
      patientName: 'Patricia Martinez',
      status: 'Denied',
      submissionDate: '2025-07-30',
      totalAmount: 2450.80,
      diag1: 'C50.911',
      diag2: 'Z85.3',
      diag3: 'Z51.11',
      udf1: 'Rush',
      udf2: 'Oncology',
      udf3: 'Dr. Parker',
      provider: 'Breast Cancer Center',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-07',
      age: 48,
      gender: 'Female',
      department: 'Oncology'
    },
    {
      id: 'CLM015',
      patientId: 'PAT10004',
      patientName: 'Daniel Harris',
      status: 'Pending Review',
      submissionDate: '2025-08-01',
      totalAmount: 875.40,
      diag1: 'K21.9',
      diag2: 'K59.00',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Gastroenterology',
      udf3: 'Dr. Lewis',
      provider: 'Digestive Health Clinic',
      insuranceType: 'Private',
      lastUpdated: '2025-08-10',
      age: 52,
      gender: 'Male',
      department: 'Gastroenterology'
    },
    {
      id: 'CLM016',
      patientId: 'PAT10005',
      patientName: 'Elizabeth Walker',
      status: 'Approved',
      submissionDate: '2025-08-03',
      totalAmount: 1195.25,
      diag1: 'H25.13',
      diag2: 'H52.4',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Ophthalmology',
      udf3: 'Dr. Turner',
      provider: 'Eye Care Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-09',
      age: 73,
      gender: 'Female',
      department: 'Ophthalmology'
    },
    {
      id: 'CLM017',
      patientId: 'PAT10006',
      patientName: 'Kevin Young',
      status: 'In Progress',
      submissionDate: '2025-08-05',
      totalAmount: 1750.90,
      diag1: 'M06.9',
      diag2: 'M79.3',
      diag3: 'Z87.891',
      udf1: 'High Priority',
      udf2: 'Rheumatology',
      udf3: 'Dr. Green',
      provider: 'Arthritis Treatment Center',
      insuranceType: 'Private',
      lastUpdated: '2025-08-11',
      age: 39,
      gender: 'Male',
      department: 'Rheumatology'
    },
    {
      id: 'CLM018',
      patientId: 'PAT10007',
      patientName: 'Michelle Robinson',
      status: 'Approved',
      submissionDate: '2025-08-07',
      totalAmount: 925.15,
      diag1: 'L40.9',
      diag2: 'L20.84',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Dermatology',
      udf3: 'Dr. Adams',
      provider: 'Skin Care Specialists',
      insuranceType: 'Private',
      lastUpdated: '2025-08-11',
      age: 34,
      gender: 'Female',
      department: 'Dermatology'
    },
    {
      id: 'CLM019',
      patientId: 'PAT10008',
      patientName: 'Steven Allen',
      status: 'Denied',
      submissionDate: '2025-08-09',
      totalAmount: 2180.45,
      diag1: 'C78.30',
      diag2: 'C25.9',
      diag3: 'K92.2',
      udf1: 'Rush',
      udf2: 'Oncology',
      udf3: 'Dr. Mitchell',
      provider: 'Cancer Research Institute',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-11',
      age: 64,
      gender: 'Male',
      department: 'Oncology'
    },
    {
      id: 'CLM020',
      patientId: 'PAT10009',
      patientName: 'Laura King',
      status: 'Pending Review',
      submissionDate: '2025-08-10',
      totalAmount: 1485.70,
      diag1: 'E10.22',
      diag2: 'H36.01',
      diag3: 'Z79.4',
      udf1: 'High Priority',
      udf2: 'Endocrinology',
      udf3: 'Dr. Scott',
      provider: 'Diabetes Care Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-11',
      age: 56,
      gender: 'Female',
      department: 'Endocrinology'
    }
  ];

  // Filter claims based on selected period
  const filteredClaims = useMemo(() => {
    const now = new Date();
    const periodDays = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '1year': 365
    };
    
    const cutoffDate = new Date(now.getTime() - (periodDays[selectedPeriod] * 24 * 60 * 60 * 1000));
    
    return sampleClaims.filter(claim => {
      const claimDate = new Date(claim.submissionDate);
      return claimDate >= cutoffDate;
    });
  }, [selectedPeriod, sampleClaims]);

  // Calculate dynamic dashboard data
  const dashboardData = useMemo(() => {
    const totalClaims = filteredClaims.length;
    const approvedClaims = filteredClaims.filter(c => c.status === 'Approved').length;
    const pendingClaims = filteredClaims.filter(c => c.status === 'Pending Review').length;
    const deniedClaims = filteredClaims.filter(c => c.status === 'Denied').length;
    const inProgressClaims = filteredClaims.filter(c => c.status === 'In Progress').length;
    
    const totalAmount = filteredClaims.reduce((sum, c) => sum + c.totalAmount, 0);
    const approvedAmount = filteredClaims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + c.totalAmount, 0);
    const pendingAmount = filteredClaims.filter(c => c.status === 'Pending Review').reduce((sum, c) => sum + c.totalAmount, 0);
    const deniedAmount = filteredClaims.filter(c => c.status === 'Denied').reduce((sum, c) => sum + c.totalAmount, 0);
    
    const approvalRate = totalClaims > 0 ? ((approvedClaims / totalClaims) * 100) : 0;
    
    // Calculate average processing time (mock calculation)
    const avgProcessingTime = filteredClaims.length > 0 ? 
      filteredClaims.reduce((sum, claim) => {
        const submitted = new Date(claim.submissionDate);
        const updated = new Date(claim.lastUpdated);
        return sum + ((updated - submitted) / (1000 * 60 * 60 * 24));
      }, 0) / filteredClaims.length : 0;

    return {
      totalClaims,
      approvedClaims,
      pendingClaims: pendingClaims + inProgressClaims, // Combine pending and in progress
      deniedClaims,
      totalAmount,
      approvedAmount,
      pendingAmount,
      deniedAmount,
      avgProcessingTime: Math.round(avgProcessingTime * 10) / 10,
      approvalRate: Math.round(approvalRate * 10) / 10,
      claimsGrowth: Math.random() * 20 - 5, // Mock growth calculation
      amountGrowth: Math.random() * 15 - 3   // Mock growth calculation
    };
  }, [filteredClaims]);

  // Dynamic claims by department
  const claimsByDepartment = useMemo(() => {
    const deptMap = {};
    filteredClaims.forEach(claim => {
      const dept = claim.department || 'Other';
      if (!deptMap[dept]) {
        deptMap[dept] = { claims: 0, amount: 0 };
      }
      deptMap[dept].claims++;
      deptMap[dept].amount += claim.totalAmount;
    });

    const colors = ['bg-red-500', 'bg-purple-500', 'bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'];
    
    return Object.entries(deptMap)
      .map(([department, data], index) => ({
        department,
        claims: data.claims,
        amount: data.amount,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.claims - a.claims);
  }, [filteredClaims]);

  // Dynamic claims over time (last 6 months)
  const claimsOverTime = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthClaims = filteredClaims.filter(claim => {
        const claimDate = new Date(claim.submissionDate);
        return claimDate.getMonth() === date.getMonth() && claimDate.getFullYear() === date.getFullYear();
      });
      
      months.push({
        month: monthName,
        approved: monthClaims.filter(c => c.status === 'Approved').length,
        pending: monthClaims.filter(c => c.status === 'Pending Review' || c.status === 'In Progress').length,
        denied: monthClaims.filter(c => c.status === 'Denied').length
      });
    }
    
    return months;
  }, [filteredClaims]);

  // Recent claims (last 5)
  const recentClaims = useMemo(() => {
    return [...filteredClaims]
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 5);
  }, [filteredClaims]);

  // Dynamic stats cards
  const statsCards = [
    {
      title: 'Total Claims',
      value: dashboardData.totalClaims.toLocaleString(),
      change: `${dashboardData.claimsGrowth >= 0 ? '+' : ''}${dashboardData.claimsGrowth.toFixed(1)}%`,
      trend: dashboardData.claimsGrowth >= 0 ? 'up' : 'down',
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Amount',
      value: `$${(dashboardData.totalAmount / 1000000).toFixed(1)}M`,
      change: `${dashboardData.amountGrowth >= 0 ? '+' : ''}${dashboardData.amountGrowth.toFixed(1)}%`,
      trend: dashboardData.amountGrowth >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Approval Rate',
      value: `${dashboardData.approvalRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Avg Processing Time',
      value: `${dashboardData.avgProcessingTime} days`,
      change: '-0.3 days',
      trend: 'down',
      icon: Clock,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  const statusCards = [
    {
      title: 'Approved',
      count: dashboardData.approvedClaims,
      amount: dashboardData.approvedAmount,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      percentage: dashboardData.totalClaims > 0 ? ((dashboardData.approvedClaims / dashboardData.totalClaims) * 100).toFixed(1) : 0
    },
    {
      title: 'Pending',
      count: dashboardData.pendingClaims,
      amount: dashboardData.pendingAmount,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      percentage: dashboardData.totalClaims > 0 ? ((dashboardData.pendingClaims / dashboardData.totalClaims) * 100).toFixed(1) : 0
    },
    {
      title: 'Denied',
      count: dashboardData.deniedClaims,
      amount: dashboardData.deniedAmount,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      percentage: dashboardData.totalClaims > 0 ? ((dashboardData.deniedClaims / dashboardData.totalClaims) * 100).toFixed(1) : 0
    }
  ];

  const getStatusStyle = (status) => {
    const styles = {
      'Pending Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Denied': 'bg-red-100 text-red-800 border-red-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Handle department click
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    setShowDepartmentDetails(true);
  };

  // Handle month click
  const handleMonthClick = (monthData) => {
    setSelectedMonth(monthData);
    setShowMonthDetails(true);
  };

  // Get department details
  const getDepartmentDetails = useMemo(() => {
    if (!selectedDepartment) return [];
    
    return filteredClaims.filter(claim => claim.department === selectedDepartment.department)
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 7);
  }, [selectedDepartment, filteredClaims]);

  // Get month details
  const getMonthDetails = useMemo(() => {
    if (!selectedMonth) return [];
    
    const monthIndex = claimsOverTime.findIndex(m => m.month === selectedMonth.month);
    if (monthIndex === -1) return [];
    
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() - (5 - monthIndex), 1);
    
    return filteredClaims.filter(claim => {
      const claimDate = new Date(claim.submissionDate);
      return claimDate.getMonth() === targetDate.getMonth() && 
             claimDate.getFullYear() === targetDate.getFullYear();
    })
    .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
    .slice(0, 7);
  }, [selectedMonth, filteredClaims, claimsOverTime]);

  // Refresh function
  const handleRefresh = () => {
    // In a real app, this would fetch new data from API
    window.location.reload();
  };

  // Export function
  const handleExport = () => {
    const exportData = {
      period: selectedPeriod,
      totalClaims: dashboardData.totalClaims,
      totalAmount: dashboardData.totalAmount,
      approvalRate: dashboardData.approvalRate,
      avgProcessingTime: dashboardData.avgProcessingTime,
      claimsByDepartment,
      recentClaims
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `claims-dashboard-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claims Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Monitor and analyze your claims performance • 
              Showing {dashboardData.totalClaims} claims for {selectedPeriod.replace('days', ' days').replace('1year', 'last year')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Period Selector */}
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
            
            {/* Action Buttons */}
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`${card.bgColor} ${card.borderColor} border-2 rounded-xl p-6 transition-all hover:shadow-xl shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <div className="flex items-center mt-2">
                    {card.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`${card.textColor} ${card.bgColor} p-3 rounded-lg shadow-md`}>
                  <IconComponent size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {statusCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} ${card.color} p-3 rounded-lg shadow-md`}>
                  <IconComponent size={24} />
                </div>
                <span className="text-sm font-medium text-gray-500">{card.percentage}%</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.count.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">
                ${(card.amount / 1000000).toFixed(2)}M total value
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Claims Over Time Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Claims Over Time</h3>
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-gray-500" />
              <span className="text-xs text-gray-500">Click bars for details</span>
            </div>
          </div>
          
          {/* Dynamic Bar Chart */}
          <div className="space-y-4">
            {claimsOverTime.map((item, index) => {
              const total = item.approved + item.pending + item.denied;
              const maxTotal = Math.max(...claimsOverTime.map(c => c.approved + c.pending + c.denied));
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{item.month}</div>
                  <div className="flex-1 flex items-center gap-1">
                    <div 
                      className="bg-green-500 h-4 rounded-l cursor-pointer hover:bg-green-600 transition-colors"
                      style={{ width: `${maxTotal > 0 ? (item.approved / maxTotal) * 100 : 0}%` }}
                      onClick={() => handleMonthClick(item)}
                      title={`${item.approved} approved claims`}
                    ></div>
                    <div 
                      className="bg-yellow-500 h-4 cursor-pointer hover:bg-yellow-600 transition-colors"
                      style={{ width: `${maxTotal > 0 ? (item.pending / maxTotal) * 100 : 0}%` }}
                      onClick={() => handleMonthClick(item)}
                      title={`${item.pending} pending claims`}
                    ></div>
                    <div 
                      className="bg-red-500 h-4 rounded-r cursor-pointer hover:bg-red-600 transition-colors"
                      style={{ width: `${maxTotal > 0 ? (item.denied / maxTotal) * 100 : 0}%` }}
                      onClick={() => handleMonthClick(item)}
                      title={`${item.denied} denied claims`}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 w-12 text-right">
                    {total}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Denied</span>
            </div>
          </div>
        </div>

        {/* Claims by Department */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Claims by Department</h3>
            <div className="flex items-center gap-2">
              <PieChart size={20} className="text-gray-500" />
              <span className="text-xs text-gray-500">Click departments for details</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {claimsByDepartment.map((dept, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                onClick={() => handleDepartmentClick(dept)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 ${dept.color} rounded shadow-sm`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{dept.department}</p>
                    <p className="text-sm text-gray-500">{dept.claims} claims</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(dept.amount / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-500">
                    {dashboardData.totalClaims > 0 ? ((dept.claims / dashboardData.totalClaims) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <Filter size={16} />
                Filter
              </button>
              <button 
                onClick={() => window.location.href = '/claims'}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Eye size={16} />
                View All
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentClaims.map((claim, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {claim.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.patientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${claim.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.submissionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/claims'}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">New Claim</span>
          </button>
          <button 
            onClick={() => window.location.href = '/claims/import'}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          >
            <Upload className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Import Claims</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          >
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Generate Report</span>
          </button>
          <button 
            onClick={() => window.location.href = '/analytics'}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          >
            <Activity className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium">View Analytics</span>
          </button>
        </div>
      </div>

      {/* Department Details Modal */}
      {showDepartmentDetails && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedDepartment.department} Department
                </h3>
                <p className="text-gray-600 mt-1">
                  {selectedDepartment.claims} claims • ${(selectedDepartment.amount / 1000).toFixed(0)}K total
                </p>
              </div>
              <button 
                onClick={() => setShowDepartmentDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <h4 className="font-medium text-gray-900 mb-4">Recent Claims ({getDepartmentDetails.length})</h4>
              <div className="space-y-3">
                {getDepartmentDetails.map((claim, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{claim.id}</p>
                      <p className="text-sm text-gray-600">{claim.patientName}</p>
                      <p className="text-xs text-gray-500">{new Date(claim.submissionDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${claim.totalAmount.toLocaleString()}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Month Details Modal */}
      {showMonthDetails && selectedMonth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedMonth.month} Claims Overview
                </h3>
                <p className="text-gray-600 mt-1">
                  {selectedMonth.approved + selectedMonth.pending + selectedMonth.denied} total claims
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    {selectedMonth.approved} Approved
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    {selectedMonth.pending} Pending
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    {selectedMonth.denied} Denied
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowMonthDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <h4 className="font-medium text-gray-900 mb-4">Recent Claims ({getMonthDetails.length})</h4>
              <div className="space-y-3">
                {getMonthDetails.map((claim, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{claim.id}</p>
                      <p className="text-sm text-gray-600">{claim.patientName} • {claim.department}</p>
                      <p className="text-xs text-gray-500">{new Date(claim.submissionDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${claim.totalAmount.toLocaleString()}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsDashboard;