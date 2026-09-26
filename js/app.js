/**
 * Sri Balajee Nagar - Community Portal Application Script
 * Features: WhatsApp Community Onboarding, Multi-step Admin Approval, Resident Edit, Bulk Add, Notices, Cloud Sync & Interactive Directory
 */

(function () {
  'use strict';

  // ==========================================
  // Storage & Default State
  // ==========================================
  const STORAGE_KEYS = {
    REQUESTS: 'sbnr_resident_requests_v7',
    SETTINGS: 'sbnr_portal_settings_v5',
    NOTICES: 'sbnr_notices_v5',
    ADMIN_SESSION: 'sbnr_admin_logged_in_v5'
  };

  const CLOUD_CONFIG = {
    ENDPOINT: 'https://api.restful-api.dev/objects/ff808181a09d98f701a0d81f649311fb',
    OBJECT_NAME: 'sbnr_community_requests_v1'
  };

  const DEFAULT_SETTINGS = {
    adminPhone: '919000011297',
    adminPassword: 'SBN@Keesara#2026',
    groupInviteUrl: 'https://chat.whatsapp.com/IsVuuxNg49gIJYPj8uIZAU?s=sh&p=i&mlu=4&ilr=4',
    colonyName: 'Sri Balajee Nagar',
    colonyAddress: 'Survey No. 75 & 76, OPP Lead India Bharat Ratnas School, Ahmedguda, Keesara Mandal, Medchal Dist, Hyderabad - 501301',
    developerName: 'Naveen G Venkata',
    developerPhone: '+91 9000011297'
  };

  const DEFAULT_NOTICES = [];
  const DEFAULT_REQUESTS = [
  {
    "id": "SBN-P1",
    "fullName": "Mr. Naresh",
    "plotNumber": "Plot 1",
    "phone": "9493724639",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P2",
    "fullName": "Mr. Naidu Leela",
    "plotNumber": "Plot 2",
    "phone": "9849411788",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P3",
    "fullName": "Mr. Swamy",
    "plotNumber": "Plot 3",
    "phone": "9390124342",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P4",
    "fullName": "Mr. Srinivas",
    "plotNumber": "Plot 4",
    "phone": "8074173085",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-9124",
    "fullName": "Naresh",
    "plotNumber": "Plot no :- 4-98/28",
    "phone": "9493724639",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered manually by Admin",
    "status": "approved",
    "timestamp": "2026-09-26T10:57:33.285Z",
    "approvedAt": "2026-09-26T10:57:33.285Z"
  },
  {
    "id": "SBN-P5",
    "fullName": "Ms. Bharathi",
    "plotNumber": "Plot 5",
    "phone": "9550111290",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P6",
    "fullName": "Ruben(Heard it seen sold)",
    "plotNumber": "Plot 6",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P7",
    "fullName": "Mr. Sampath",
    "plotNumber": "Plot 7",
    "phone": "7396688113",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P7-B",
    "fullName": "Mrs. Sampath",
    "plotNumber": "Plot 7",
    "phone": "9885645151",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P8",
    "fullName": "Mr. Bojaiah",
    "plotNumber": "Plot 8",
    "phone": "9059913430",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P8-B",
    "fullName": "Mr. Girish",
    "plotNumber": "Plot 8",
    "phone": "7569148568",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P9",
    "fullName": "Mr. Laxman",
    "plotNumber": "Plot 9",
    "phone": "8142486392",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P10",
    "fullName": "Mr. Bharat",
    "plotNumber": "Plot 10",
    "phone": "6302335983",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P11",
    "fullName": "Mr. Monohar",
    "plotNumber": "Plot 11",
    "phone": "6302370291",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P12",
    "fullName": "Mr. Sunil",
    "plotNumber": "Plot 12",
    "phone": "9160003358",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P13",
    "fullName": "Mr. Rajendra and Mrs. Meena",
    "plotNumber": "Plot 13",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P13-B",
    "fullName": "Mrs. Meena Kumari",
    "plotNumber": "Plot 13",
    "phone": "9392312462",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P14",
    "fullName": "Mr. Rajendra",
    "plotNumber": "Plot 14",
    "phone": "9010205497",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P15",
    "fullName": "Mr. Madhu",
    "plotNumber": "Plot 15",
    "phone": "9848051483",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P16",
    "fullName": "Mrs. Vavilala Sarma",
    "plotNumber": "Plot 16",
    "phone": "9000033320",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P17",
    "fullName": "Mr. Feroz",
    "plotNumber": "Plot 17",
    "phone": "9182589178",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P18",
    "fullName": "Mr. Kalyan",
    "plotNumber": "Plot 18",
    "phone": "7780755292",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P19",
    "fullName": "Mr. Mishra",
    "plotNumber": "Plot 19",
    "phone": "8688858680",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P20",
    "fullName": "M.Divya",
    "plotNumber": "Plot 20",
    "phone": "9260692233",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-3253",
    "fullName": "M V Divya",
    "plotNumber": "Plot # 20, H# 4-98/04",
    "phone": "9160692233",
    "residentType": "House / Plot Owner (Residing)",
    "email": "divya8616@gmail.com",
    "notes": "since 2021, now tenant (Neelakanth garu) is residing since 2024",
    "status": "approved",
    "timestamp": "2026-09-26T09:14:20.619Z",
    "approvedAt": "2026-09-26T10:33:44.984Z"
  },
  {
    "id": "SBN-P21",
    "fullName": "Pudari Akshaya",
    "plotNumber": "Plot 21",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P22",
    "fullName": "Mr. Konda Reddy (Open Plot)",
    "plotNumber": "Plot 22",
    "phone": "",
    "residentType": "House / Plot Owner (Constructing / Open Plot)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P23",
    "fullName": "Mr. Mathew",
    "plotNumber": "Plot 23",
    "phone": "8848001550",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P24",
    "fullName": "Mr. Naidu",
    "plotNumber": "Plot 24",
    "phone": "8374727553",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P25",
    "fullName": "Mr. Rama Krishna",
    "plotNumber": "Plot 25",
    "phone": "9700230199",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P26",
    "fullName": "Mr. Eshwar babu",
    "plotNumber": "Plot 26",
    "phone": "9399972906",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P27",
    "fullName": "Mr. Sadeeth",
    "plotNumber": "Plot 27",
    "phone": "9848031760",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P28",
    "fullName": "Mr. Naveen",
    "plotNumber": "Plot 28",
    "phone": "9000011297",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P28-B",
    "fullName": "Mrs. Kumari",
    "plotNumber": "Plot 28",
    "phone": "9652678090",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P29",
    "fullName": "Mr. Satyanarayana",
    "plotNumber": "Plot 29",
    "phone": "9573225622",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P30",
    "fullName": "Manjula",
    "plotNumber": "Plot 30",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P31",
    "fullName": "Mr. Ramesh",
    "plotNumber": "Plot 31",
    "phone": "9652447007",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P32",
    "fullName": "Mr.Rama Chandra Rao",
    "plotNumber": "Plot 32",
    "phone": "9247393076",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P33",
    "fullName": "Mr. Varun",
    "plotNumber": "Plot 33",
    "phone": "9885582779",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P34",
    "fullName": "Mrs.Sarada",
    "plotNumber": "Plot 34",
    "phone": "8897720631",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P35",
    "fullName": "Mr. Phaninder",
    "plotNumber": "Plot 35",
    "phone": "9866307986",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P36",
    "fullName": "Mr. Sai Rantna",
    "plotNumber": "Plot 36",
    "phone": "9949468506",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P37",
    "fullName": "Mr. Prasad garu",
    "plotNumber": "Plot 37",
    "phone": "9666458397",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P38",
    "fullName": "Mr. Bhumesh",
    "plotNumber": "Plot 38",
    "phone": "9966320775",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P39",
    "fullName": "Mr. Ravi & Mrs. Jahnavi",
    "plotNumber": "Plot 39",
    "phone": "9989602324",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P40",
    "fullName": "Mr. Venkatesh",
    "plotNumber": "Plot 40",
    "phone": "9848732103",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P41",
    "fullName": "Mr. Ahmed",
    "plotNumber": "Plot 41",
    "phone": "9966026361",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P42",
    "fullName": "Mr. Balaji Singh",
    "plotNumber": "Plot 42",
    "phone": "9000374059",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P43",
    "fullName": "Owner (Plot 43)",
    "plotNumber": "Plot 43",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P44",
    "fullName": "Owner (Plot 44)",
    "plotNumber": "Plot 44",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P45",
    "fullName": "Owner (Plot 45)",
    "plotNumber": "Plot 45",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P46",
    "fullName": "Owner (Plot 46)",
    "plotNumber": "Plot 46",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P47",
    "fullName": "Mr. Raja Lakshmi",
    "plotNumber": "Plot 47",
    "phone": "9703433554",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P48",
    "fullName": "Mr. Pramod",
    "plotNumber": "Plot 48",
    "phone": "8977041255",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P49",
    "fullName": "Dr. Ramesh",
    "plotNumber": "Plot 49",
    "phone": "9000955957",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P50",
    "fullName": "Owner (Plot 50)",
    "plotNumber": "Plot 50",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P51",
    "fullName": "Owner (Plot 51)",
    "plotNumber": "Plot 51",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P52",
    "fullName": "Owner (Plot 52)",
    "plotNumber": "Plot 52",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P53",
    "fullName": "Mr. Srinivas",
    "plotNumber": "Plot 53",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P54",
    "fullName": "Mr. Kalyan",
    "plotNumber": "Plot 54",
    "phone": "7396829210",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P55",
    "fullName": "Mr. Vamshi",
    "plotNumber": "Plot 55",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P56",
    "fullName": "Mr. Prasad and Mrs. Yashoda",
    "plotNumber": "Plot 56",
    "phone": "9014764317",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P57",
    "fullName": "Mr. Konda Venkata Reddy",
    "plotNumber": "Plot 57",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P58",
    "fullName": "Mr. Madhukar",
    "plotNumber": "Plot 58",
    "phone": "9705322141",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P59",
    "fullName": "Mr. Sudhakar",
    "plotNumber": "Plot 59",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P60",
    "fullName": "Mr. Das",
    "plotNumber": "Plot 60",
    "phone": "9246295678",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P61",
    "fullName": "Mr. Narsimha Reddy",
    "plotNumber": "Plot 61",
    "phone": "9866785500",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P62",
    "fullName": "Mr. Raja Shekar",
    "plotNumber": "Plot 62",
    "phone": "",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P63",
    "fullName": "Mr. Ravi Kumar",
    "plotNumber": "Plot 63",
    "phone": "9949044427",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P64",
    "fullName": "Vani",
    "plotNumber": "Plot 64",
    "phone": "9703867405",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P64-a",
    "fullName": "Owner (Plot 64/a)",
    "plotNumber": "Plot 64/A",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P66",
    "fullName": "Mr. Narender / Mr. Hota",
    "plotNumber": "Plot 66",
    "phone": "9704042314",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P66-a",
    "fullName": "Mr. R.K. Hota",
    "plotNumber": "Plot 66/A",
    "phone": "6375646654",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P67",
    "fullName": "Mrs. Rama",
    "plotNumber": "Plot 67",
    "phone": "9100432895",
    "residentType": "House / Plot Owner (Residing)",
    "email": "",
    "notes": "Registered Owner - Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  },
  {
    "id": "SBN-P68",
    "fullName": "Owner (Plot 68)",
    "plotNumber": "Plot 68",
    "phone": "",
    "residentType": "House / Plot Owner (Open Plot)",
    "email": "",
    "notes": "Open Plot - Registered with Sri Balajee Nagar Owner Welfare Association",
    "status": "approved",
    "timestamp": "2026-09-26T10:00:00.000Z",
    "approvedAt": "2026-09-26T10:00:00.000Z"
  }
];

  // ==========================================
  // Helper State Managers & Cloud Sync
  // ==========================================
  function getSettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(saved);
    if (!parsed.groupInviteUrl || !parsed.groupInviteUrl.includes('s=sh') || parsed.groupInviteUrl.includes('sample-')) {
      parsed.groupInviteUrl = DEFAULT_SETTINGS.groupInviteUrl;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  function getRequests() {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(DEFAULT_REQUESTS));
      return DEFAULT_REQUESTS;
    }
    const parsed = JSON.parse(saved);
    const existingIds = new Set(parsed.map(r => r.id));
    let hasNew = false;
    DEFAULT_REQUESTS.forEach(defReq => {
      if (!existingIds.has(defReq.id)) {
        parsed.push(defReq);
        hasNew = true;
      }
    });
    if (hasNew) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(parsed));
    }
    return parsed;
  }

  function saveRequests(requests) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }

  async function pushRequestsToCloud(requests) {
    try {
      await fetch(CLOUD_CONFIG.ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: CLOUD_CONFIG.OBJECT_NAME,
          data: { requests: requests }
        })
      });
    } catch (err) {
      console.warn('Cloud sync push warning:', err);
    }
  }

  async function syncCloudRequests(silent = false) {
    const syncBtnText = document.getElementById('btnSyncCloudText');
    if (syncBtnText) syncBtnText.textContent = '⏳ Syncing...';

    try {
      const response = await fetch(CLOUD_CONFIG.ENDPOINT);
      if (response.ok) {
        const json = await response.json();
        const cloudRequests = (json.data && Array.isArray(json.data.requests)) ? json.data.requests : [];
        
        // Merge cloud requests with local requests
        const localRequests = getRequests();
        const mergedMap = new Map();

        // Cloud items first
        cloudRequests.forEach(req => {
          if (req && req.id) mergedMap.set(req.id, req);
        });

        // Local items
        localRequests.forEach(req => {
          if (req && req.id) {
            if (mergedMap.has(req.id)) {
              const cloudItem = mergedMap.get(req.id);
              if (req.status === 'approved' && cloudItem.status !== 'approved') {
                mergedMap.set(req.id, req);
              }
            } else {
              mergedMap.set(req.id, req);
            }
          }
        });

        const mergedList = Array.from(mergedMap.values());
        mergedList.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

        saveRequests(mergedList);
        pushRequestsToCloud(mergedList);
        
        renderAdminRequests();
        if (!silent) {
          showToast(`Cloud Sync Complete: ${mergedList.length} resident records up to date.`, 'success');
        }
      }
    } catch (err) {
      console.warn('Could not sync with cloud:', err);
      if (!silent) {
        showToast('Could not connect to cloud sync. Loaded local storage records.', 'warning');
      }
    } finally {
      if (syncBtnText) syncBtnText.textContent = '🔄 Sync Cloud';
    }
  }

  function getNotices() {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(DEFAULT_NOTICES));
      return DEFAULT_NOTICES;
    }
    return JSON.parse(saved);
  }

  function saveNotices(notices) {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }

  // ==========================================
  // UI Toast Engine
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="#22c55e" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 8v4m0 4h.01"/></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="#f59e0b" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 16v-4m0-4h.01"/></svg>';
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // Modal Control
  // ==========================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Setup Global Modal Close listeners
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Escape Key to close active modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          m.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
    });

    // Initialize Components
    initNavbar();
    initJoinWhatsAppFlow();
    initNotices();
    initAdminPortal();
    initGalleryLightbox();
  });

  // ==========================================
  // Navbar Logic
  // ==========================================
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
        });
      });
    }
  }

  // ==========================================
  // Join WhatsApp Group Modal & Approval Flow
  // ==========================================
  function initJoinWhatsAppFlow() {
    const openBtns = document.querySelectorAll('.trigger-join-wa');
    const form = document.getElementById('joinGroupForm');
    const formStep = document.getElementById('joinFormStep');
    const successStep = document.getElementById('joinSuccessStep');
    const sendDirectWaBtn = document.getElementById('btnSendDirectWa');

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Reset form & steps
        if (form) form.reset();
        if (formStep && successStep) {
          formStep.style.display = 'block';
          successStep.style.display = 'none';
        }
        openModal('joinGroupModal');
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('reqFullName').value.trim();
        const plotNumber = document.getElementById('reqPlotNumber').value.trim();
        let phone = document.getElementById('reqPhone').value.trim().replace(/\D/g, '');
        const residentType = document.getElementById('reqResidentType').value;
        const email = document.getElementById('reqEmail').value.trim();
        const notes = document.getElementById('reqNotes').value.trim();

        if (!fullName || !plotNumber || !phone) {
          showToast('Please fill in all mandatory fields (Name, House / Plot Number, Phone)', 'error');
          return;
        }

        if (phone.length < 10) {
          showToast('Please enter a valid 10-digit mobile number', 'error');
          return;
        }

        const settings = getSettings();
        const cleanAdminPhone = settings.adminPhone.replace(/\D/g, '');
        const requests = getRequests();

        // Generate unique Ref ID for every new submission
        let refNo;
        do {
          refNo = 'SBN-' + Math.floor(1000 + Math.random() * 9000);
        } while (requests.some(r => r.id === refNo));

        const newRequest = {
          id: refNo,
          fullName,
          plotNumber,
          phone,
          residentType,
          email,
          notes,
          status: 'pending',
          timestamp: new Date().toISOString()
        };

        // 1. Save into local database first (Admin portal updated before sending WhatsApp)
        requests.unshift(newRequest);
        saveRequests(requests);

        // 2. Sync to cloud database centrally so all admin devices see it immediately
        pushRequestsToCloud(requests);

        // 3. Re-render admin table immediately if admin view is active
        renderAdminRequests();

        // 4. Build prefilled WhatsApp message to Admin for approval
        const waMessage = 
`🏛️ *SRI BALAJEE NAGAR - RESIDENT GROUP JOIN REQUEST*

👤 *Resident Name:* ${fullName}
🏡 *House / Plot No:* ${plotNumber}
📱 *WhatsApp Number:* +91 ${phone}
🏷️ *Resident Category:* ${residentType}
📧 *Email:* ${email || 'N/A'}
📝 *Notes:* ${notes || 'Resident of Sri Balajee Nagar'}
🔖 *Request Ref ID:* #${refNo}

-----------------------------
*To Colony Admin:*
Kindly review my house / plot details and approve adding me to the official Sri Balajee Nagar WhatsApp Community.`;

        const waUrl = `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(waMessage)}`;

        // 5. Update Success Step UI
        document.getElementById('successRefId').textContent = '#' + refNo;
        document.getElementById('successName').textContent = fullName;
        document.getElementById('successPlot').textContent = plotNumber;
        document.getElementById('successPhone').textContent = '+91 ' + phone;
        document.getElementById('successType').textContent = residentType;

        const joinGroupLinkBtn = document.getElementById('btnJoinGroupLink');
        if (joinGroupLinkBtn) {
          joinGroupLinkBtn.href = settings.groupInviteUrl;
        }

        if (sendDirectWaBtn) {
          sendDirectWaBtn.onclick = () => {
            window.open(waUrl, '_blank');
          };
        }

        // 6. Show Success Step first
        formStep.style.display = 'none';
        successStep.style.display = 'block';

        showToast(`Request #${refNo} recorded in Admin Portal! Opening WhatsApp to send verification...`, 'success');

        // 7. Auto-launch WhatsApp directly to Admin Naveen (+91 9000011297)
        setTimeout(() => {
          try {
            window.open(waUrl, '_blank');
          } catch (err) {
            console.warn('Popup blocked, accessible via button', err);
          }
        }, 350);
      });
    }
  }

  // ==========================================
  // WhatsApp Message Parser
  // ==========================================
  function parseWhatsAppMessage(text) {
    if (!text || typeof text !== 'string') return null;

    const cleanText = text.replace(/[*_~`]/g, '');

    // Extract Name
    let name = '';
    const nameMatch = cleanText.match(/(?:Resident Name|Full Name|Name)\s*:\s*([^\n\r]+)/i);
    if (nameMatch) {
      name = nameMatch[1].trim();
    }

    // Extract Plot / House Number
    let plotNumber = '';
    const plotMatch = cleanText.match(/(?:House \/ Plot No|House \/ Plot Number|Plot No|House No|Plot Number|Plot)\s*:\s*([^\n\r]+)/i);
    if (plotMatch) {
      plotNumber = plotMatch[1].trim();
    }

    // Extract Phone Number
    let phone = '';
    const phoneMatch = cleanText.match(/(?:WhatsApp Number|Mobile Number|Mobile|Phone Number|Phone)\s*:\s*([^\n\r]+)/i);
    if (phoneMatch) {
      phone = phoneMatch[1].replace(/\D/g, '');
      if (phone.startsWith('91') && phone.length === 12) {
        phone = phone.slice(2);
      }
    } else {
      const anyPhoneMatch = cleanText.match(/(?:(?:\+?91)[\s-]?)?([6-9]\d{9})/);
      if (anyPhoneMatch) {
        phone = anyPhoneMatch[1];
      }
    }

    // Extract Resident Category
    let residentType = 'House / Plot Owner (Residing)';
    const catMatch = cleanText.match(/(?:Resident Category|Category|Status)\s*:\s*([^\n\r]+)/i);
    if (catMatch) {
      const parsedCat = catMatch[1].trim();
      if (parsedCat) residentType = parsedCat;
    }

    // Extract Ref ID if present
    let refId = '';
    const refMatch = cleanText.match(/(?:Request Ref ID|Ref ID|Ref No|Reference ID)\s*:\s*#?([A-Za-z0-9-]+)/i);
    if (refMatch) {
      refId = refMatch[1].trim().replace(/^#/, '');
    }

    // Extract Email
    let email = '';
    const emailMatch = cleanText.match(/(?:Email Address|Email)\s*:\s*([^\n\r]+)/i);
    if (emailMatch) {
      const candidateEmail = emailMatch[1].trim();
      if (candidateEmail.includes('@') && !candidateEmail.toLowerCase().includes('n/a')) {
        email = candidateEmail;
      }
    }

    // Extract Notes
    let notes = '';
    const notesMatch = cleanText.match(/(?:Notes|Reference)\s*:\s*([^\n\r]+)/i);
    if (notesMatch) {
      notes = notesMatch[1].trim();
    }

    if (!name && !plotNumber && !phone) {
      return null;
    }

    return {
      fullName: name || 'Resident',
      plotNumber: plotNumber || 'Plot Verification',
      phone: phone || '',
      residentType,
      refId,
      email,
      notes: notes || 'Imported from resident WhatsApp message'
    };
  }

  // ==========================================
  // Notice Board Engine
  // ==========================================
  function initNotices() {
    renderNotices('all');

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');
        renderNotices(category);
      });
    });
  }

  function renderNotices(categoryFilter = 'all') {
    const container = document.getElementById('noticesGrid');
    if (!container) return;

    const notices = getNotices();
    const filtered = categoryFilter === 'all' 
      ? notices 
      : notices.filter(n => n.category === categoryFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass); color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📢</div>
          <h4 style="color: #ffffff; font-size: 1.15rem; margin-bottom: 0.4rem;">No Active Circulars</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 450px; margin-inline: auto;">Official announcements and colony circulars will be published here by the association committee.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(notice => `
      <div class="notice-card ${notice.category}">
        <div class="notice-card-header">
          <span class="notice-category-badge ${notice.category}">${notice.category.toUpperCase()}</span>
          <span class="notice-date">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            ${notice.date}
          </span>
        </div>
        <h4 class="notice-title">${escapeHtml(notice.title)}</h4>
        <p class="notice-body">${escapeHtml(notice.content)}</p>
        <div class="notice-footer">
          <span class="notice-author">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            ${escapeHtml(notice.author)}
          </span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // Admin Portal & Approval Management
  // ==========================================
  function initAdminPortal() {
    const adminTriggerBtns = document.querySelectorAll('.trigger-admin-portal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const btnToggleAdminPass = document.getElementById('btnToggleAdminPass');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    // Password show/hide toggle
    if (btnToggleAdminPass && adminPasswordInput) {
      btnToggleAdminPass.addEventListener('click', () => {
        const isPass = adminPasswordInput.getAttribute('type') === 'password';
        adminPasswordInput.setAttribute('type', isPass ? 'text' : 'password');
        btnToggleAdminPass.textContent = isPass ? '🙈' : '👁️';
      });
    }

    // Sub-tab toggles in Add Resident pane
    const btnSubTabSingle = document.getElementById('btnSubTabSingle');
    const btnSubTabBulk = document.getElementById('btnSubTabBulk');
    const paneSingleResident = document.getElementById('paneSingleResident');
    const paneBulkResidents = document.getElementById('paneBulkResidents');

    if (btnSubTabSingle && btnSubTabBulk) {
      btnSubTabSingle.addEventListener('click', () => {
        btnSubTabSingle.classList.add('active');
        btnSubTabBulk.classList.remove('active');
        if (paneSingleResident) paneSingleResident.style.display = 'block';
        if (paneBulkResidents) paneBulkResidents.style.display = 'none';
      });

      btnSubTabBulk.addEventListener('click', () => {
        btnSubTabBulk.classList.add('active');
        btnSubTabSingle.classList.remove('active');
        if (paneSingleResident) paneSingleResident.style.display = 'none';
        if (paneBulkResidents) paneBulkResidents.style.display = 'block';
      });
    }

    // Admin Navigation Tabs
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const target = btn.getAttribute('data-tab');
        const activePane = document.getElementById(target);
        if (activePane) activePane.style.display = 'block';
      });
    });

    adminTriggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isLoggedIn = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
        if (isLoggedIn) {
          openAdminDashboard();
        } else {
          if (adminPasswordInput) {
            adminPasswordInput.value = '';
            adminPasswordInput.setAttribute('type', 'password');
            if (btnToggleAdminPass) btnToggleAdminPass.textContent = '👁️';
          }
          openModal('adminLoginModal');
        }
      });
    });

    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        const enteredPassword = adminPasswordInput ? adminPasswordInput.value.trim() : '';

        const validMaster = settings.adminPassword || 'SBN@Keesara#2026';
        if (enteredPassword === validMaster) {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
          closeModal('adminLoginModal');
          openAdminDashboard();
          showToast('Welcome, Administrator! Access granted.', 'success');
        } else {
          showToast('Invalid Administrator Password. Access denied.', 'error');
        }
      });
    }

    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        closeModal('adminPortalModal');
        showToast('Logged out of Admin Portal.', 'info');
      });
    }

    // Search filter for requests
    const searchInput = document.getElementById('adminSearchRequests');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderAdminRequests(searchInput.value);
      });
    }

    // Sync Cloud button
    const btnSyncCloud = document.getElementById('btnSyncCloudRequests');
    if (btnSyncCloud) {
      btnSyncCloud.addEventListener('click', () => {
        syncCloudRequests(false);
      });
    }

    // Export CSV
    const exportBtn = document.getElementById('btnExportRequests');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportRequestsToCSV);
    }

    // Select All & Delete Selected Checkbox Handler
    const thSelectAll = document.getElementById('thSelectAllRequests');
    const deleteSelectedBtn = document.getElementById('btnDeleteSelectedRequests');
    const deleteSelectedBtnText = document.getElementById('deleteSelectedBtnText');

    window.sbnrPortalUpdateSelected = function () {
      const checkedBoxes = document.querySelectorAll('.req-row-checkbox:checked');
      const count = checkedBoxes.length;
      if (deleteSelectedBtn) {
        if (count > 0) {
          deleteSelectedBtn.style.display = 'inline-flex';
          if (deleteSelectedBtnText) deleteSelectedBtnText.textContent = `Delete Selected (${count})`;
        } else {
          deleteSelectedBtn.style.display = 'none';
        }
      }
      if (thSelectAll) {
        const allBoxes = document.querySelectorAll('.req-row-checkbox');
        thSelectAll.checked = allBoxes.length > 0 && checkedBoxes.length === allBoxes.length;
      }
    };

    if (thSelectAll) {
      thSelectAll.addEventListener('change', () => {
        const allBoxes = document.querySelectorAll('.req-row-checkbox');
        allBoxes.forEach(cb => {
          cb.checked = thSelectAll.checked;
        });
        if (window.sbnrPortalUpdateSelected) window.sbnrPortalUpdateSelected();
      });
    }

    if (deleteSelectedBtn) {
      deleteSelectedBtn.addEventListener('click', () => {
        const checkedBoxes = document.querySelectorAll('.req-row-checkbox:checked');
        const count = checkedBoxes.length;
        if (count === 0) return;

        if (!confirm(`Are you sure you want to permanently delete the ${count} selected resident record(s)?`)) return;

        const selectedIds = Array.from(checkedBoxes).map(cb => cb.getAttribute('data-id'));
        const requests = getRequests();
        const remaining = requests.filter(r => !selectedIds.includes(r.id));
        saveRequests(remaining);
        pushRequestsToCloud(remaining);
        renderAdminRequests();
        showToast(`${count} resident record(s) deleted successfully.`, 'info');
      });
    }

    // Button to open Add Resident Tab directly from toolbar
    const openAddResidentBtn = document.getElementById('btnOpenAddResidentTab');
    if (openAddResidentBtn) {
      openAddResidentBtn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.style.display = 'none');

        const addResidentTabBtn = document.querySelector('.admin-tab-btn[data-tab="tabAddResident"]');
        if (addResidentTabBtn) addResidentTabBtn.classList.add('active');

        const addResidentPane = document.getElementById('tabAddResident');
        if (addResidentPane) addResidentPane.style.display = 'block';
      });
    }

    // Button to open Import WA Modal
    const btnOpenImportWaModal = document.getElementById('btnOpenImportWaModal');
    if (btnOpenImportWaModal) {
      btnOpenImportWaModal.addEventListener('click', () => {
        const textarea = document.getElementById('importWaTextarea');
        if (textarea) textarea.value = '';
        openModal('importWaModal');
      });
    }

    // Button to Parse and Import WA text
    const btnParseAndImportWa = document.getElementById('btnParseAndImportWa');
    if (btnParseAndImportWa) {
      btnParseAndImportWa.addEventListener('click', () => {
        const textarea = document.getElementById('importWaTextarea');
        const text = textarea ? textarea.value.trim() : '';

        if (!text) {
          showToast('Please paste the resident WhatsApp message text.', 'error');
          return;
        }

        const parsed = parseWhatsAppMessage(text);
        if (!parsed || (!parsed.fullName && !parsed.plotNumber)) {
          showToast('Could not extract resident details. Please verify the message format.', 'error');
          return;
        }

        const requests = getRequests();
        let refNo = parsed.refId;
        if (!refNo || requests.some(r => r.id === refNo)) {
          do {
            refNo = 'SBN-' + Math.floor(1000 + Math.random() * 9000);
          } while (requests.some(r => r.id === refNo));
        }

        const newResident = {
          id: refNo,
          fullName: parsed.fullName,
          plotNumber: parsed.plotNumber,
          phone: parsed.phone,
          residentType: parsed.residentType,
          email: parsed.email,
          notes: parsed.notes,
          status: 'pending',
          timestamp: new Date().toISOString()
        };

        requests.unshift(newResident);
        saveRequests(requests);
        pushRequestsToCloud(requests);

        closeModal('importWaModal');
        renderAdminRequests();
        showToast(`Imported ${parsed.fullName} (${parsed.plotNumber}) as #${refNo}!`, 'success');
      });
    }

    // Single Manual Add Resident Form Handler
    const addResidentForm = document.getElementById('adminAddResidentForm');
    if (addResidentForm) {
      addResidentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('adminManualName').value.trim();
        const plotNumber = document.getElementById('adminManualPlot').value.trim();
        let phone = document.getElementById('adminManualPhone').value.trim().replace(/\D/g, '');
        const residentType = document.getElementById('adminManualType').value;
        const customRefId = document.getElementById('adminManualRefId') ? document.getElementById('adminManualRefId').value.trim() : '';
        const initialStatus = document.getElementById('adminManualInitialStatus').value;
        const email = document.getElementById('adminManualEmail').value.trim();
        const notes = document.getElementById('adminManualNotes').value.trim();

        if (!fullName || !plotNumber || !phone) {
          showToast('Please fill in all mandatory fields (Name, House / Plot Number, Phone)', 'error');
          return;
        }

        if (phone.length < 10) {
          showToast('Please enter a valid 10-digit mobile number', 'error');
          return;
        }

        const requests = getRequests();
        let refNo = customRefId ? (customRefId.startsWith('SBN-') ? customRefId : 'SBN-' + customRefId) : '';
        if (!refNo || requests.some(r => r.id === refNo)) {
          do {
            refNo = 'SBN-' + Math.floor(1000 + Math.random() * 9000);
          } while (requests.some(r => r.id === refNo));
        }

        const newResident = {
          id: refNo,
          fullName,
          plotNumber,
          phone,
          residentType,
          email,
          notes: notes || 'Registered manually by Admin',
          status: initialStatus,
          timestamp: new Date().toISOString(),
          approvedAt: initialStatus === 'approved' ? new Date().toISOString() : null
        };

        requests.unshift(newResident);
        saveRequests(requests);
        pushRequestsToCloud(requests);

        const settings = getSettings();

        // If approved, launch WhatsApp to send group invite
        if (initialStatus === 'approved') {
          const inviteMsg = 
`🎉 *WELCOME TO SRI BALAJEE NAGAR COMMUNITY!*

Dear *${fullName}*,
Your details for *${plotNumber}* have been registered and *APPROVED* in the Sri Balajee Nagar Resident Portal! 🎊

👉 *Join the Official Resident WhatsApp Group here:*
${settings.groupInviteUrl}

Please save this link and join the group for daily colony updates, emergency alerts, and community discussions.

_Warm regards,_
*Sri Balajee Nagar Welfare Association*`;

          const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(inviteMsg)}`;
          try {
            window.open(waUrl, '_blank');
          } catch (err) {
            console.warn('Popup blocked', err);
          }
        }

        addResidentForm.reset();
        showToast(`Resident ${fullName} (#${refNo}) added successfully!`, 'success');

        // Switch back to requests tab and render table
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.style.display = 'none');

        const reqTabBtn = document.querySelector('.admin-tab-btn[data-tab="tabRequests"]');
        if (reqTabBtn) reqTabBtn.classList.add('active');

        const reqPane = document.getElementById('tabRequests');
        if (reqPane) reqPane.style.display = 'block';

        renderAdminRequests();
      });
    }

    // Bulk Add Multiple Residents Form Handler
    const bulkAddForm = document.getElementById('adminBulkAddForm');
    if (bulkAddForm) {
      bulkAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textarea = document.getElementById('adminBulkTextarea');
        const text = textarea ? textarea.value.trim() : '';
        const defaultStatus = document.getElementById('adminBulkDefaultStatus').value || 'approved';
        const defaultType = document.getElementById('adminBulkDefaultType').value || 'House / Plot Owner (Residing)';

        if (!text) {
          showToast('Please paste resident entries.', 'error');
          return;
        }

        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        const requests = getRequests();
        let addedCount = 0;

        lines.forEach(line => {
          let parts = line.split(/[,\t|]/).map(p => p.trim());
          let name = '', plot = '', phone = '', type = defaultType, status = defaultStatus;

          if (parts.length >= 3) {
            name = parts[0];
            plot = parts[1];
            phone = parts[2].replace(/\D/g, '');
            if (parts.length >= 4 && parts[3]) {
              type = parts[3];
            }
          } else if (parts.length === 2) {
            name = parts[0];
            plot = parts[1];
          } else {
            const match = line.match(/^([^,]+)[,\s]+(Plot[^\d]*\d+[^,]*)[,\s]+(\d{10})/i);
            if (match) {
              name = match[1].trim();
              plot = match[2].trim();
              phone = match[3].trim();
            } else {
              name = line;
              plot = 'Plot Verification';
            }
          }

          if (phone.startsWith('91') && phone.length === 12) {
            phone = phone.slice(2);
          }

          if (name || plot || phone) {
            let refNo;
            do {
              refNo = 'SBN-' + Math.floor(1000 + Math.random() * 9000);
            } while (requests.some(r => r.id === refNo));

            requests.unshift({
              id: refNo,
              fullName: name || 'Resident',
              plotNumber: plot || 'Plot Verification',
              phone: phone || '',
              residentType: type,
              email: '',
              notes: 'Bulk imported by Admin',
              status: status,
              timestamp: new Date().toISOString(),
              approvedAt: status === 'approved' ? new Date().toISOString() : null
            });
            addedCount++;
          }
        });

        if (addedCount > 0) {
          saveRequests(requests);
          pushRequestsToCloud(requests);
          bulkAddForm.reset();
          showToast(`Successfully added ${addedCount} resident records!`, 'success');

          // Switch back to requests tab
          tabBtns.forEach(b => b.classList.remove('active'));
          tabPanes.forEach(p => p.style.display = 'none');

          const reqTabBtn = document.querySelector('.admin-tab-btn[data-tab="tabRequests"]');
          if (reqTabBtn) reqTabBtn.classList.add('active');

          const reqPane = document.getElementById('tabRequests');
          if (reqPane) reqPane.style.display = 'block';

          renderAdminRequests();
        } else {
          showToast('No valid resident records could be parsed.', 'error');
        }
      });
    }

    // Edit Resident Form Handler
    const editResidentForm = document.getElementById('adminEditResidentForm');
    if (editResidentForm) {
      editResidentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const refId = document.getElementById('editResidentRefId').value;
        const fullName = document.getElementById('editResidentName').value.trim();
        const plotNumber = document.getElementById('editResidentPlot').value.trim();
        let phone = document.getElementById('editResidentPhone').value.trim().replace(/\D/g, '');
        const residentType = document.getElementById('editResidentType').value;
        const status = document.getElementById('editResidentStatus').value;
        const email = document.getElementById('editResidentEmail').value.trim();
        const notes = document.getElementById('editResidentNotes').value.trim();

        if (!fullName || !plotNumber || !phone) {
          showToast('Please fill in mandatory fields (Name, Plot Number, Phone)', 'error');
          return;
        }

        if (phone.length < 10) {
          showToast('Please enter a valid 10-digit mobile number', 'error');
          return;
        }

        const requests = getRequests();
        const index = requests.findIndex(r => r.id === refId);
        if (index === -1) {
          showToast('Resident record not found.', 'error');
          return;
        }

        requests[index].fullName = fullName;
        requests[index].plotNumber = plotNumber;
        requests[index].phone = phone;
        requests[index].residentType = residentType;
        requests[index].status = status;
        requests[index].email = email;
        requests[index].notes = notes;
        requests[index].updatedAt = new Date().toISOString();
        if (status === 'approved' && !requests[index].approvedAt) {
          requests[index].approvedAt = new Date().toISOString();
        }

        saveRequests(requests);
        pushRequestsToCloud(requests);
        closeModal('editResidentModal');
        renderAdminRequests();
        showToast(`Resident #${refId} (${fullName}) updated successfully!`, 'success');
      });
    }

    // Settings Form
    const settingsForm = document.getElementById('adminSettingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const settings = getSettings();
        settings.adminPhone = document.getElementById('settingAdminPhone').value.trim();
        settings.groupInviteUrl = document.getElementById('settingGroupUrl').value.trim();
        const newPassword = document.getElementById('settingNewPassword').value.trim();
        if (newPassword) {
          if (newPassword.length < 8) {
            showToast('Admin password must be at least 8 characters long.', 'error');
            return;
          }
          settings.adminPassword = newPassword;
        }
        saveSettings(settings);
        showToast('Colony admin settings updated successfully!', 'success');
      });
    }

    // Add Notice Form
    const newNoticeForm = document.getElementById('adminNewNoticeForm');
    if (newNoticeForm) {
      newNoticeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('noticeTitleInput').value.trim();
        const category = document.getElementById('noticeCatInput').value;
        const author = document.getElementById('noticeAuthorInput').value.trim() || 'RWA Office';
        const content = document.getElementById('noticeContentInput').value.trim();

        if (!title || !content) {
          showToast('Please provide notice title and message content', 'error');
          return;
        }

        const notices = getNotices();
        notices.unshift({
          id: 'not-' + Date.now(),
          title,
          category,
          date: 'Just Now',
          author,
          content
        });

        saveNotices(notices);
        newNoticeForm.reset();
        renderNotices('all');
        showToast('New announcement posted to notice board!', 'success');
      });
    }
  }

  function openAdminDashboard() {
    renderAdminRequests();
    loadAdminSettingsValues();
    openModal('adminPortalModal');
    // Sync freshest records from cloud database silently in background
    syncCloudRequests(true);
  }

  function loadAdminSettingsValues() {
    const settings = getSettings();
    const phoneInput = document.getElementById('settingAdminPhone');
    const urlInput = document.getElementById('settingGroupUrl');
    const newPasswordInput = document.getElementById('settingNewPassword');

    if (phoneInput) phoneInput.value = settings.adminPhone;
    if (urlInput) urlInput.value = settings.groupInviteUrl;
    if (newPasswordInput) newPasswordInput.value = '';
  }

  function renderAdminRequests(searchTerm = '') {
    const tbody = document.getElementById('adminRequestsTbody');
    const pendingCountBadge = document.getElementById('adminPendingCount');
    if (!tbody) return;

    const requests = getRequests();
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    if (pendingCountBadge) {
      pendingCountBadge.textContent = pendingCount;
    }

    const term = searchTerm.toLowerCase();
    const filtered = requests.filter(r => 
      (r.fullName && r.fullName.toLowerCase().includes(term)) ||
      (r.plotNumber && r.plotNumber.toLowerCase().includes(term)) ||
      (r.phone && r.phone.includes(term)) ||
      (r.id && r.id.toLowerCase().includes(term))
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No resident requests found matching your search.
          </td>
        </tr>
      `;
      if (window.sbnrPortalUpdateSelected) window.sbnrPortalUpdateSelected();
      return;
    }

    tbody.innerHTML = filtered.map(req => {
      const isPending = req.status === 'pending';
      const isApproved = req.status === 'approved';

      return `
        <tr>
          <td style="text-align: center;">
            <input type="checkbox" class="req-row-checkbox" data-id="${escapeHtml(req.id)}" onchange="window.sbnrPortalUpdateSelected()" style="cursor: pointer;">
          </td>
          <td>
            <span style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(req.id)}</span>
          </td>
          <td>
            <div class="resident-cell">
              <span class="r-name">${escapeHtml(req.fullName)}</span>
              <span class="r-sub">${escapeHtml(req.residentType)}</span>
            </div>
          </td>
          <td>
            <span class="plot-badge">${escapeHtml(req.plotNumber)}</span>
          </td>
          <td>
            <a href="tel:+91${escapeHtml(req.phone)}" style="color: #60a5fa; font-weight: 600;">+91 ${escapeHtml(req.phone)}</a>
          </td>
          <td>
            <span class="status-badge ${req.status}">${req.status}</span>
          </td>
          <td style="text-align: right;">
            <div class="admin-row-actions" style="justify-content: flex-end;">
              ${isPending ? `
                <button class="btn-action-approve" onclick="window.sbnrPortal.approveResident('${req.id}')" title="Approve & Send WhatsApp Invite">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Approve & Send
                </button>
                <button class="btn-action-reject" onclick="window.sbnrPortal.rejectResident('${req.id}')" title="Reject Request">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              ` : isApproved ? `
                <button class="btn-action-approve" onclick="window.sbnrPortal.resendInvite('${req.id}')" title="Resend WhatsApp Invite">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Resend Invite
                </button>
              ` : `
                <span style="font-size: 0.75rem; color: #94a3b8;">Archived</span>
              `}
              <button class="btn-action-edit" onclick="window.sbnrPortal.openEditResidentModal('${req.id}')" title="Edit details for #${req.id}">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>Edit</span>
              </button>
              <button class="btn-action-delete" onclick="window.sbnrPortal.deleteResident('${req.id}')" title="Delete specific entry #${req.id}" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>Delete</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.sbnrPortalUpdateSelected) window.sbnrPortalUpdateSelected();
  }

  // Global Exposed Functions for Table Button Actions
  window.sbnrPortal = {
    openEditResidentModal: function (reqId) {
      const requests = getRequests();
      const req = requests.find(r => r.id === reqId);
      if (!req) return;

      const editRefId = document.getElementById('editResidentRefId');
      const editRefIdDisplay = document.getElementById('editResidentRefIdDisplay');
      const editDateDisplay = document.getElementById('editResidentDateDisplay');
      const editName = document.getElementById('editResidentName');
      const editPlot = document.getElementById('editResidentPlot');
      const editPhone = document.getElementById('editResidentPhone');
      const editType = document.getElementById('editResidentType');
      const editStatus = document.getElementById('editResidentStatus');
      const editEmail = document.getElementById('editResidentEmail');
      const editNotes = document.getElementById('editResidentNotes');

      if (editRefId) editRefId.value = req.id;
      if (editRefIdDisplay) editRefIdDisplay.textContent = '#' + req.id;
      if (editDateDisplay) editDateDisplay.textContent = req.timestamp ? new Date(req.timestamp).toLocaleDateString() : 'N/A';
      if (editName) editName.value = req.fullName || '';
      if (editPlot) editPlot.value = req.plotNumber || '';
      if (editPhone) editPhone.value = req.phone || '';
      if (editType) editType.value = req.residentType || 'House / Plot Owner (Residing)';
      if (editStatus) editStatus.value = req.status || 'pending';
      if (editEmail) editEmail.value = req.email || '';
      if (editNotes) editNotes.value = req.notes || '';

      openModal('editResidentModal');
    },

    approveResident: function (reqId) {
      const requests = getRequests();
      const settings = getSettings();
      const index = requests.findIndex(r => r.id === reqId);

      if (index === -1) return;

      const req = requests[index];
      req.status = 'approved';
      req.approvedAt = new Date().toISOString();
      saveRequests(requests);
      pushRequestsToCloud(requests);

      renderAdminRequests();

      // Build Approval & Invite WhatsApp Message to Resident
      const inviteMsg = 
`🎉 *WELCOME TO SRI BALAJEE NAGAR COMMUNITY!*

Dear *${req.fullName}*,
Your request for *${req.plotNumber}* has been verified and *APPROVED* by the Sri Balajee Nagar Welfare Association! 🎊

👉 *Join the Official Resident WhatsApp Group here:*
${settings.groupInviteUrl}

Please save this link and join the group for daily colony updates, emergency alerts, and community discussions.

_Warm regards,_
*Sri Balajee Nagar Welfare Association*`;

      const residentPhone = req.phone.replace(/\D/g, '');
      const waUrl = `https://wa.me/91${residentPhone}?text=${encodeURIComponent(inviteMsg)}`;

      showToast(`Approved ${req.fullName}! Launching WhatsApp to send group invite...`, 'success');
      window.open(waUrl, '_blank');
    },

    rejectResident: function (reqId) {
      if (!confirm('Are you sure you want to reject this request?')) return;

      const requests = getRequests();
      const index = requests.findIndex(r => r.id === reqId);
      if (index === -1) return;

      requests[index].status = 'rejected';
      saveRequests(requests);
      pushRequestsToCloud(requests);
      renderAdminRequests();
      showToast('Request marked as rejected.', 'info');
    },

    deleteResident: function (reqId) {
      const requests = getRequests();
      const req = requests.find(r => r.id === reqId);
      const name = req ? req.fullName : 'this resident';
      if (!confirm(`Are you sure you want to permanently delete request #${reqId} (${name})?`)) return;

      const filtered = requests.filter(r => r.id !== reqId);
      saveRequests(filtered);
      pushRequestsToCloud(filtered);
      renderAdminRequests();
      showToast(`Request #${reqId} deleted successfully.`, 'info');
    },

    resendInvite: function (reqId) {
      const requests = getRequests();
      const settings = getSettings();
      const req = requests.find(r => r.id === reqId);
      if (!req) return;

      const inviteMsg = 
`👋 *Sri Balajee Nagar WhatsApp Group Invite Reminder*

Dear *${req.fullName}* (${req.plotNumber}),
Here is your official WhatsApp group invite link:
${settings.groupInviteUrl}

_Sri Balajee Nagar Welfare Association_`;

      const residentPhone = req.phone.replace(/\D/g, '');
      const waUrl = `https://wa.me/91${residentPhone}?text=${encodeURIComponent(inviteMsg)}`;
      window.open(waUrl, '_blank');
    }
  };

  // ==========================================
  // Export CSV Feature
  // ==========================================
  function exportRequestsToCSV() {
    const requests = getRequests();
    if (requests.length === 0) {
      showToast('No resident records to export.', 'error');
      return;
    }

    const headers = ['Request ID', 'Full Name', 'House / Plot Number', 'Phone Number', 'Resident Type', 'Email', 'Status', 'Submitted At', 'Approved At'];
    const rows = requests.map(r => [
      `"${r.id}"`,
      `"${r.fullName}"`,
      `"${r.plotNumber}"`,
      `"${r.phone}"`,
      `"${r.residentType}"`,
      `"${r.email || ''}"`,
      `"${r.status}"`,
      `"${r.timestamp}"`,
      `"${r.approvedAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sri_Balajee_Nagar_Residents_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Resident directory exported to CSV!', 'success');
  }

  // ==========================================
  // Gallery Lightbox
  // ==========================================
  function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (!lightboxModal) return;

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption p');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          if (caption && lightboxCaption) {
            lightboxCaption.textContent = caption.textContent;
          }
          openModal('lightboxModal');
        }
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
