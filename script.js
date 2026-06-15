console.log("SCRIPT VERSION 12-06-2026");

const SHEET_URL =
"https://opensheet.elk.sh/1o6skM5ZgGk6TNMf0ITwA6n9FpKQT3l80_2_V-lMItGM/ฐานข้อมูลสารเคมีสัตว์น้ำ";

let waterVolumeM3 = 0;
let waterVolumeLiter = 0;
let pondAreaRai = 0;
function calculateVolume() {

    const pondType =
        document.getElementById("pondType").value;

    const width =
        parseFloat(document.getElementById("width").value) || 0;

    const length =
        parseFloat(document.getElementById("length").value) || 0;

    const depth =
        parseFloat(document.getElementById("depth").value) || 0;

if (width <= 0 || depth <= 0) {
    alert("กรุณากรอกข้อมูลบ่อให้ครบ");
    return;
}
if (length <= 0) {
    alert("กรุณากรอกความยาว");
    return;
}
    let volume = 0;
    let area = 0;

if (pondType === "บ่อรูปสี่เหลี่ยม") {

        area = width * length;
        volume = area * depth;
    }

    else if (pondType === "บ่อรูปทรงกลม") {

        const radius = width / 2;

        area = Math.PI * radius * radius;
        volume = area * depth;
    }

    else if (pondType === "บ่อรูปวงรี") {

        area = Math.PI * (width / 2) * (length / 2);
        volume = area * depth;
    }
    const liter = volume * 1000;
    const rai = area / 1600;

    waterVolumeM3 = volume;
    waterVolumeLiter = liter;
    pondAreaRai = rai;

    document.getElementById("result").innerHTML =
        "ปริมาตรน้ำ = " + volume.toFixed(2) + " ลบ.ม.<br>" +
        "ปริมาตรน้ำ = " + liter.toLocaleString() + " ลิตร<br><br>" +
        "พื้นที่บ่อ = " + area.toFixed(2) + " ตร.ม.<br>" +
        "พื้นที่บ่อ = " + rai.toFixed(2) + " ไร่";
        
}

fetch(SHEET_URL)
  .then(response => response.json())
  .then(data => {

      chemicalData = data;
      console.log("ข้อมูลทั้งหมดจากชีท", data);

      const saltData =
          data.filter(item =>
              item["ชนิดสาร"] === "เกลือ"
          );

      console.log("ข้อมูลเกลือ", saltData);

      const objectiveSelect =
          document.getElementById("objective");

      console.log(data);

      const objectives =
          [...new Set(
              data.map(item => item["วัตถุประสงค์"])
          )];

      objectives.forEach(objective => {

          let option =
              document.createElement("option");

          option.value = objective;
          option.textContent = objective;

          objectiveSelect.appendChild(option);

      });

  });
  function loadChemicals() {

    const purpose =
        document.getElementById("objective").value;

    const chemicalSelect =
        document.getElementById("chemical");

    chemicalSelect.innerHTML =
        '<option value="">-- เลือกสารเคมี --</option>';

    if (!purpose) return;

    const filteredChemicals =
        chemicalData.filter(item =>
            item["วัตถุประสงค์"] === purpose
        );

    filteredChemicals.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item["ชนิดสาร"];
        option.textContent = item["ชนิดสาร"];

        chemicalSelect.appendChild(option);

    });

}
function changePondType() {

    const pondType =
        document.getElementById("pondType").value;

    const widthLabel =
        document.getElementById("widthLabel");

    const lengthLabel =
        document.getElementById("lengthLabel");

    const lengthInput =
        document.getElementById("length");

    if (pondType === "บ่อรูปทรงกลม") {

        widthLabel.textContent =
            "เส้นผ่านศูนย์กลาง (เมตร)";

        lengthLabel.style.display = "none";
        lengthInput.style.display = "none";

    }

    else if (pondType === "บ่อรูปวงรี") {

        widthLabel.textContent =
            "ความกว้างแกนสั้น (เมตร)";

        lengthLabel.textContent =
            "ความยาวแกนยาว (เมตร)";

        lengthLabel.style.display = "block";
        lengthInput.style.display = "block";

    }

    else {

        widthLabel.textContent =
            "ความกว้าง (เมตร)";

        lengthLabel.textContent =
            "ความยาว (เมตร)";

        lengthLabel.style.display = "block";
        lengthInput.style.display = "block";

    }

}
changePondType();
function getUnitInfo(concentrationUnit) {

    concentrationUnit =
        String(concentrationUnit)
        .trim()
        .toLowerCase();

console.log(
    "[" + concentrationUnit + "]"
);

    switch (concentrationUnit)  {

        case "ppm":

            return {
                useUnit: "ppm",
                resultUnit: "กิโลกรัม"
            };
        case "ppt":
            return {
                useUnit: "กรัม/น้ำ 1 ลิตร",
                resultUnit: "กิโลกรัม"
    };

        case "มิลลิกรัม/น้ำ 1 ลิตร":

            return {
                useUnit: "มิลลิกรัม/น้ำ 1 ลิตร",
                resultUnit: "กิโลกรัม"
            };

        case "กรัม/น้ำ 1 ลิตร":

            return {
                useUnit: "กรัม/น้ำ 1 ลิตร",
                resultUnit: "กิโลกรัม"
            };

        case "มิลลิลิตร/น้ำ 1 ลิตร":

            return {
                useUnit: "มิลลิลิตร/น้ำ 1 ลิตร",
                resultUnit: "ลิตร"
            };

        case "กิโลกรัม/ไร่":

            return {
                useUnit: "กิโลกรัม/ไร่",
                resultUnit: "กิโลกรัม"
            };

        default:

            return {
                useUnit: concentrationUnit,
                resultUnit: "-"
            };
            
    }
}
function loadChemicalInfo() {

    const selectedChemical =
        document.getElementById("chemical").value;

    const purpose =
    document.getElementById("objective").value;

const chemical =
    chemicalData.find(item =>
        item["ชนิดสาร"] === selectedChemical &&
        item["วัตถุประสงค์"] === purpose
    );

console.log("โหลดข้อมูลสาร:", chemical);

    if (!chemical) return;

    document.getElementById("minRate").value =
        chemical["อัตราการใช้ต่ำสุด"];

    document.getElementById("maxRate").value =
        chemical["อัตราการใช้สูงสุด"];

    document.getElementById("unit").value =
        chemical["หน่วยความเข้มข้น"];

    console.log(
          "หน่วยจากชีท =",
          chemical["หน่วยความเข้มข้น"]

);
    const unitInfo =
    getUnitInfo(
        chemical["หน่วยความเข้มข้น"]
    );
        console.log("หน่วยจากชีท =", chemical["หน่วยความเข้มข้น"]);
        console.log("unitInfo =", unitInfo);
        
    document.getElementById("useUnit").value =
        unitInfo.useUnit;
    
    document.getElementById("resultUnit").value =
        unitInfo.resultUnit;

    document.getElementById("selectedRate").value =
        chemical["อัตราการใช้ต่ำสุด"];

console.log(chemical);

}   // 

function calculateChemical() {
    
console.log("waterVolumeLiter =", waterVolumeLiter);
console.log("waterVolumeM3 =", waterVolumeM3);
console.log("pondAreaRai =", pondAreaRai);
    const chemicalName =
        document.getElementById("chemical").value;

    const purpose =
    document.getElementById("objective").value;

const chemical =
    chemicalData.find(item =>
        item["ชนิดสาร"] === chemicalName &&
        item["วัตถุประสงค์"] === purpose
    );
console.log("คำนวณจากข้อมูล:", chemical);

    if (!chemical) {
        alert("กรุณาเลือกสารเคมี");
        return;
    }

    const minRate =
        parseFloat(chemical["อัตราการใช้ต่ำสุด"]);

    const maxRate =
        parseFloat(chemical["อัตราการใช้สูงสุด"]);

console.log("selectedRate =", document.getElementById("selectedRate"));
console.log("chemicalResult =", document.getElementById("chemicalResult"));
console.log("chemical =", document.getElementById("chemical"));

    const rate =
        parseFloat(
        document.getElementById("selectedRate").value
    );

    if (rate < minRate || rate > maxRate) {

    alert(
        `กรุณาใส่อัตราระหว่าง ${minRate} - ${maxRate}`
    );

    return;
}
    const unitInfo =
    getUnitInfo(
        chemical["หน่วยความเข้มข้น"]
    );

    const useUnit =
        unitInfo.useUnit;

    const resultUnit =
        unitInfo.resultUnit;

    let result = 0;

console.log("useUnit =", useUnit);
console.log("resultUnit =", resultUnit);

    switch (useUnit) {

    case "ppm":
    case "มิลลิกรัม/น้ำ 1 ลิตร":

    result =
        (waterVolumeLiter * rate) / 1000000;

    break;

    case "กรัม/น้ำ 1 ลิตร":

    result =
        (waterVolumeLiter * rate) / 1000;

    break;

case "มิลลิลิตร/น้ำ 1 ลิตร":
case "ซีซี/น้ำ 1 ลิตร":

    result =
        (waterVolumeLiter * rate) / 1000;

    break;

case "มิลลิลิตร/ลูกบาศก์เมตร":
case "กรัม/ลูกบาศก์เมตร":

    result =
        (waterVolumeM3 * rate) / 1000;

    break;

case "กิโลกรัม/ไร่":

    result =
        pondAreaRai * rate;

    break;

case "กรัม/ไร่":

    result =
        (pondAreaRai * rate) / 1000;

    break;

case "ลิตร/ไร่":

    result =
        pondAreaRai * rate;

    break;
}

let resultText = `${result.toFixed(2)} ${resultUnit}`;

if (resultUnit === "กิโลกรัม") {
    resultText += ` (${(result * 1000).toFixed(0)} กรัม)`;
}

document.getElementById("chemicalResult").innerHTML =
`
<h3>ผลการคำนวณ</h3>

<p><b>ชนิดสารเคมี:</b> ${chemicalName}</p>

<p><b>ปริมาตรน้ำ:</b>
${waterVolumeLiter.toLocaleString()} ลิตร
</p>

พื้นที่บ่อ : ${pondAreaRai.toFixed(4)} ไร่<br>

<p><b>อัตราที่เลือกใช้:</b>
${rate} ${useUnit}
</p>

<hr>

<h3>ต้องใช้สารเคมี ${resultText}</h3>
`;

}

