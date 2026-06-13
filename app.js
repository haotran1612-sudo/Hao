	const API_URL =
	"https://script.google.com/macros/s/AKfycbzcp8bu5J-GpAFWhjY1QiP4SOcLnk_Qku9FdOp_G_Q851cC3y3qFw4Wxgu9A4-8uP3s_A/exec";

	/* LOGIN */

	async function login(){

		const email =
		document.getElementById(
			"loginEmail"
		).value;

		const password =
		document.getElementById(
			"loginPassword"
		).value;

		const response =
		await fetch(API_URL,{

			method:"POST",

			body:JSON.stringify({

				action:"login",

				email,
				password

			})

		});

		const data =
		await response.json();

		if(data.success){

			localStorage.setItem(
				"userEmail",
				email
			);

			document
			.getElementById(
				"loginPage"
			)
			.style.display="none";

			document
			.getElementById(
				"appPage"
			)
			.style.display="block";

			document
			.getElementById(
				"welcomeUser"
			)
			.innerHTML=email;

			alert("Đăng nhập thành công");

		}else{

			alert(
				"Sai tài khoản hoặc mật khẩu"
			);
		}
	}

	/* REGISTER */

	async function registerUser(){

		const name =
		document.getElementById(
			"registerName"
		).value;

		const email =
		document.getElementById(
			"registerEmail"
		).value;

		const password =
		document.getElementById(
			"registerPassword"
		).value;

		const response =
		await fetch(API_URL,{

			method:"POST",

			body:JSON.stringify({

				action:"register",

				name,
				email,
				password

			})

		});

		const data =
		await response.json();

		if(data.success){

			alert(
				"Đăng ký thành công"
			);

		}else{

			alert(
				"Đăng ký thất bại"
			);
		}
	}

	/* LOGOUT */

	function logout(){

		localStorage.clear();

		location.reload();
	}

	/* MODAL */

	function openTaskModal(){

		document
		.getElementById(
			"taskModal"
		)
		.style.display="block";
	}

	function closeTaskModal(){

		document
		.getElementById(
			"taskModal"
		)
		.style.display="none";
	}

	/* SAVE TASK */

	async function saveTask(){

		const payload = {

			action:"createTask",

			email:
			localStorage.getItem(
				"userEmail"
			),

			taskName:
			document.getElementById(
				"taskName"
			).value,

			start:
			document.getElementById(
				"startDate"
			).value,

			deadline:
			document.getElementById(
				"deadline"
			).value,

			taskType:
			document.getElementById(
				"taskType"
			).value,

			priority:
			document.getElementById(
				"priority"
			).value,

			status:
			document.getElementById(
				"status"
			).value,

			calendarTitle:
			document.getElementById(
				"calendarTitle"
			).value,

			location:
			document.getElementById(
				"location"
			).value,

			attendees:
			document.getElementById(
				"attendees"
			).value,

			reminder:
			document.getElementById(
				"reminder"
			).value,

			apply:
			document.getElementById(
				"applyCalendar"
			).checked,

			sendMail:
			document.getElementById(
				"sendMail"
			).checked
		};

		const response =
		await fetch(API_URL,{

			method:"POST",

			body:JSON.stringify(
				payload
			)

		});

		const data =
		await response.json();
	if(data.success){

		alert("Tạo task thành công");

		closeTaskModal();

		loadTasks(); // reload bảng

		// 🔥 RESET FORM SAU KHI SAVE
		document.getElementById("taskName").value = "";
		document.getElementById("taskDescription").value = "";
		document.getElementById("startDate").value = "";
		document.getElementById("deadline").value = "";
		document.getElementById("taskType").value = "Daily";
		document.getElementById("priority").value = "Normal";
		document.getElementById("status").value = "Todo";
		document.getElementById("calendarTitle").value = "";
		document.getElementById("location").value = "";
		document.getElementById("attendees").value = "";
		document.getElementById("meetLink").value = "";
		document.getElementById("reminder").value = "30";
		document.getElementById("applyCalendar").checked = false;
		document.getElementById("sendMail").checked = false;
	}else{

			alert(
				"Lỗi tạo task"
			);
		}
	}

	/* AUTO LOGIN */

	window.onload = function(){

		const user =
		localStorage.getItem(
			"userEmail"
		);

		if(user){

			document
			.getElementById(
				"loginPage"
			)
			.style.display="none";

			document
			.getElementById(
				"appPage"
			)
			.style.display="block";

			document
			.getElementById(
				"welcomeUser"
			)
			.innerHTML=user;
		}
	};
	function showTracker(){

		document
		.querySelector(".kanban")
		.style.display="none";

		document
		.getElementById(
		  "trackerPage"
		)
		.style.display="block";

		loadTasks();
	}

	function showKanban(){

		document
		.querySelector(".kanban")
		.style.display="flex";

		document
		.getElementById(
		  "trackerPage"
		)
		.style.display="none";
	}

	async function loadTasks(){

		const email =
		localStorage.getItem(
		  "userEmail"
		);

		const response =
		await fetch(API_URL,{

			method:"POST",

			body:JSON.stringify({

				action:"getTasks",

				email

			})

		});

		const data =
		await response.json();

		const tbody =
		document.getElementById(
		  "taskTableBody"
		);

		tbody.innerHTML="";

		data.tasks.forEach(task=>{

			const tr =
			document.createElement("tr");

			if(
			  task.priority ===
			  "Urgent"
			){
			  tr.classList.add(
				"urgent-row"
			  );
			}

			tr.innerHTML=`

				<td>
<input 
  type="datetime-local"
  value="${formatDate(task.start)}"
  onchange="updateTask(${task.row},'start',this.value)"
>
</td>
<td>
<input 
  type="datetime-local"
  value="${formatDate(task.deadline)}"
  onchange="updateTask(${task.row},'deadline',this.value)"
>
</td>
				<td>
	  
	<input 
		value="${task.taskName}" 
		onchange="updateTask(${task.row},'taskName',this.value)"
	  >
	</td>
				<td>${task.week}</td>
				<td>${task.priority}</td>
				<td>${task.status}</td>
				<td>${task.taskType}</td>

			`;

			tbody.appendChild(tr);

		});

	} 
	async function addRow(){

		const email = localStorage.getItem("userEmail");

		const response = await fetch(API_URL,{
			method:"POST",
			body:JSON.stringify({
				action:"addEmptyRow",
				email
			})
		});

		const data = await response.json();

		if(data.success){
			loadTasks();
		}
	} 
	function formatDate(value){

    if(!value) return "";

    const d = new Date(value);

    const pad = n => n.toString().padStart(2,'0');

    const year = d.getFullYear();
    const month = pad(d.getMonth()+1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const min = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hour}:${min}`;
} 
function updateTask(row, field, value){

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            action: "updateTask",
            row,
            field,
            value
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("UPDATE OK:", data);
    })
    .catch(err => {
        console.log("UPDATE ERROR:", err);
    });

}