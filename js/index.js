$(document).ready(function(){
    const ctx = document.getElementById('myChart');
    const USERNAME = "coalition";
    const PASSWORD = "skills-test";
    const selectedPatient = "Jessica Taylor";
    const months = [];
    const systolic = [];
    const diastolic = [];
    const monthObj = {
        "January": "Jan",
        "February": "Feb",
        "March": "Mar",
        "April": "Apr",
        "May": "May",
        "June": "Jun",
        "July": "Jul",
        "August": "Aug",
        "September": "Sep",
        "October": "Oct",
        "November": "Nov",
        "December": "Dec"
    };
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const labResults = [];
    const diagnosticList = [];
    const allPatients = [];
    const patientInformation = [];
    let respiratoryRate = 0;
    let temperature = 0;
    let heartRate = 0;
    let systolicCount = 0;
    let diastolicCount = 0;
    $.ajax({
        type: "GET",
        url: "https://fedskillstest.coalitiontechnologies.workers.dev",
        dataType: 'json',
        headers: {
            "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
        },
        data: '{ "comment" }',
        success: function (patients) {
            const patient = patients.find(item => item.name === selectedPatient)
            patient.diagnosis_history.map((item, index) => {
                if (index <= 5) {
                    months.push(`${monthObj[item.month]} ${item.year}`);
                    systolic.push(item.blood_pressure.systolic.value);
                    diastolic.push(item.blood_pressure.diastolic.value);
                    respiratoryRate += item.respiratory_rate.value;
                    temperature += item.temperature.value;
                    heartRate += item.heart_rate.value;
                    systolicCount += item.blood_pressure.systolic.value;
                    diastolicCount += item.blood_pressure.diastolic.value;
                }
            });
            patients.map(patient => {
                const activePatientDiv = patient.name === selectedPatient ? "<div class='d-flex flex-row justify-content-between patient-container active-patient'>" : "<div class='d-flex flex-row justify-content-between patient-container'>";
                allPatients.push(
                    activePatientDiv+
                        "<div class='d-flex flex-row'>"+
                            "<img src="+patient.profile_picture+" class='patient-image' />"+
                            "<div class='patient-username'>"+
                                "<span class='username'>"+patient.name+"</span><br/>"+
                                "<span class='user-role'>"+`${patient.gender}, ${patient.age}`+"</span>"+
                            "</div>"+
                        "</div>"+
                        "<img src='../images/more_horiz_FILL0_wght300_GRAD0_opsz24.png' class='more-horizontal' />"+
                    "</div>"
                );
            })
            patient.lab_results.map(item => {
                labResults.push(
                    "<div class='d-flex flex-row justify-content-between lab-result-details'><span class='lab-result-name'>"+item+"</span><img src='../images/download_FILL0_wght300_GRAD0_opsz24 (1).png' class='download-icon' /></div>"
                );
            });
            patient.diagnostic_list.map(item => {
                diagnosticList.push(
                    "<tr><td>"+item.name+"</td><td>"+item.description+"</td><td>"+item.status+"</td></tr>"
                );
            });
            const patientName = "<div class='d-flex flex-column align-items-center mb-4'>"+
                "<img src="+patient.profile_picture+" class='user-lg' />"+
                "<span class='user-lg-name'>"+patient.name+"</span>"+
            "</div>";
            const patientDOB = "<div class='d-flex flex-row user-detail-container'>"+
                "<img src='../images/BirthIcon.png' class='user-information-icon' />"+
                "<div>"+
                    "<span class='user-information-label'>Date Of Birth</span><br/>"+
                    "<span class='user-information-text'>"+`${new Date(patient.date_of_birth).toLocaleDateString('en-US', options)}`+"</span>"+
                "</div>"+
            "</div>";
            const patientGender = "<div class='d-flex flex-row user-detail-container'>"+
                "<img src='../images/FemaleIcon.png' class='user-information-icon' />"+
                "<div>"+
                    "<span class='user-information-label'>Gender</span><br/>"+
                    "<span class='user-information-text'>"+patient.gender+"</span>"+
                "</div>"+
            "</div>";
            const patientContact = "<div class='d-flex flex-row user-detail-container'>"+
                "<img src='../images/PhoneIcon.png' class='user-information-icon' />"+
                "<div>"+
                    "<span class='user-information-label'>Contact Info.</span><br/>"+
                    "<span class='user-information-text'>"+patient.phone_number+"</span>"+
                "</div>"+
            "</div>"
            const patientEmergencyContact = "<div class='d-flex flex-row user-detail-container'>"+
                "<img src='../images/PhoneIcon.png' class='user-information-icon' />"+
                "<div>"+
                    "<span class='user-information-label'>Emergency Contact</span><br/>"+
                    "<span class='user-information-text'>"+patient.emergency_contact+"</span>"+
                "</div>"+
            "</div>";
            const patientInsurance = "<div class='d-flex flex-row user-detail-container'>"+
                "<img src='../images/InsuranceIcon.png' class='user-information-icon' />"+
                "<div>"+
                    "<span class='user-information-label'>Insurance Provider</span><br/>"+
                    "<span class='user-information-text'>"+patient.insurance_type+"</span>"+
                "</div>"+
            "</div>";
            patientInformation.push(
                patientName,
                patientDOB,
                patientGender,
                patientContact,
                patientEmergencyContact,
                patientInsurance
            );
            $("#lab-results").append(labResults.join(""));
            $("#diagnostic-list").append(diagnosticList.join(""));
            $("#patients").append(allPatients.join(""));
            $("#patient-information").append(patientInformation.join(""));
            $("#respiratory-rate").append(`${(respiratoryRate/6).toFixed(0)} bpm`);
            $("#temperature").append(`${(temperature/6).toFixed(1)}°F`);
            $("#heart-rate").append(`${(heartRate/6).toFixed(0)} bpm`);
            $("#systolic-average").append(`${(systolicCount/6).toFixed(0)}`);
            $("#diastolic-average").append(`${(diastolicCount/6).toFixed(0)}`);
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                        label: 'Systolic',
                        data: systolic,
                        borderColor: "#E66FD2",
                        backgroundColor: "#E66FD2",
                        },
                        {
                        label: "Diastolic",
                        data: diastolic,
                        borderColor: "#8C6FE6",
                        backgroundColor: "#8C6FE6",
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: true,
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                            position: 'top',
                        },
                        title: {
                            display: false,
                            text: 'Chart.js Line Chart'
                        }
                    }
                }
            });
        }
    });
});