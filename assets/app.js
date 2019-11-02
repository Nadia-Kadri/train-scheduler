var firebaseConfig = {
    apiKey: "AIzaSyAX3NBJngTZnGnXCWRprJPr4PEbuN_IA2o",
    databaseURL: "https://train-schedule-1f34e.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// sortTable()

$("#run-search").on("click", function (event) {

    event.preventDefault();

    let trainName = $("#train-name-search").val().trim();
    let destination = $("#destination-search").val().trim();
    let firstTime = $("#first-time-search").val().trim();
    let frequency = $("#frequency-search").val().trim();

    if (trainName === "" || destination === "" || firstTime === "" || frequency === "") {
        $("#error").html("Please complete all fields")
        return;
    }

    if ((moment(firstTime, "HH:mm", true).format() === "Invalid date") && (isNaN(frequency))) {
        $("#error").html("Please enter date in specified format<br>Please enter a number in frequency field")
        return;
    }

    if (moment(firstTime, "HH:mm", true).format() === "Invalid date") {
        $("#error").html("Please enter date in specified format")
        return;
    }

    if (isNaN(frequency)) {
        $("#error").html("Please enter a number in frequency field")
        return;
    }

    database.ref().push({
        name: trainName,
        destination: destination,
        time: firstTime,
        frequency: frequency
    });

    $("#train-name-search").val("")
    $("#destination-search").val("")
    $("#first-time-search").val("")
    $("#frequency-search").val("")
    $("#error").html("")

});

database.ref().on("child_added", function(snapshot) {

    let trainName = snapshot.val().name;
    let destination = snapshot.val().destination;
    let firstTime = snapshot.val().time;
    let frequency = snapshot.val().frequency;

    let firstTimeConverted = moment(firstTime, "HH:mm").format("hh:mm a")
    let timeDiff = moment().diff(moment(firstTime, "HH:mm"), "minutes")

    console.log(`Name: ${trainName}`)
    console.log(`Destination: ${destination}`)
    console.log(`Train start: ${firstTimeConverted}`)
    console.log(`Comes every: ${frequency} minutes`)

    let timeNow = moment().format("hh:mm a")
    console.log(`Time now: ${timeNow}`)
    
    if(timeDiff > 0) {
        let timeRemainder = timeDiff % frequency;

        if (timeRemainder === 0) {
            console.log("Train is in station")
            console.log("--------------------------")
    
            var newRow = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(destination),
                $("<td>").text(firstTimeConverted),
                $("<td>").text(frequency),
                $("<td>").text("BOARDING NOW"),
                $("<td>").text("BOARDING NOW")
              );
        
            $("#train-schedule").append(newRow);
        } else {
            let minutesAway = frequency - timeRemainder;

            let nextTrain = moment().add(minutesAway, "minutes");
            let nextTrainConverted = moment(nextTrain).format("hh:mm a")
            console.log(`Next train: ${nextTrainConverted}`)
            console.log("--------------------------")

            var newRow = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(destination),
                $("<td>").text(firstTimeConverted),
                $("<td>").text(frequency),
                $("<td>").text(nextTrainConverted),
                $("<td>").text(minutesAway)
            );
        
            $("#train-schedule").append(newRow);
        }
    } else if (timeDiff < 0) {
        let nextTrainConverted = firstTimeConverted
        console.log(`Next train: ${nextTrainConverted}`)
        console.log("--------------------------")

        let minutesAway = moment(nextTrainConverted, "hh:mm a").diff(moment(), "minutes") + 1

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(firstTimeConverted),
            $("<td>").text(frequency),
            $("<td>").text(nextTrainConverted),
            $("<td>").text(minutesAway)
          );
    
        $("#train-schedule").append(newRow);
    } else {
        console.log("Train is in station")
        console.log("--------------------------")

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(firstTimeConverted),
            $("<td>").text(frequency),
            $("<td>").text("BOARDING NOW"),
            $("<td>").text("BOARDING NOW")
          );
    
        $("#train-schedule").append(newRow);
    }
});




// function sortTable() {
//     var table, rows, switching, i, x, y, shouldSwitch;
//     table = document.getElementById("train-schedule-table");
//     switching = true;
//     console.log(table.rows)
//     console.log(table)
//     /*Make a loop that will continue until
//     no switching has been done:*/
//     while (switching) {
//       //start by saying: no switching is done:
//       switching = false;
//       rows = table.rows;
//       console.log(rows)
//       console.log(table.rows.length)
//       /*Loop through all table rows (except the
//       first, which contains table headers):*/
//       for (i = 1; i < (rows.length - 1); i++) {
//         //start by saying there should be no switching:
//         console.log(i)
//         shouldSwitch = false;
//         /*Get the two elements you want to compare,
//         one from current row and one from the next:*/
//         x = rows[i].getElementsByTagName("TD")[0];
//         console.log(x)
//         y = rows[i + 1].document.getElementsByTagName("TD")[5];
//         //check if the two rows should switch place:
//         if (Number(x.innerHTML) > Number(y.innerHTML)) {
//           //if so, mark as a switch and break the loop:
//           shouldSwitch = true;
//           break;
//         }
//       }
//       if (shouldSwitch) {
//         /*If a switch has been marked, make the switch
//         and mark that a switch has been done:*/
//         rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//         switching = true;
//       }
//     }
//   }


