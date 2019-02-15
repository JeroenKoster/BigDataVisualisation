const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');
const d3 = require('d3');

const dataSet = [];

function Row(age, ageGroup, bmi, alcohol, sickdays, disabilityRisk, exercise, somber, smoking, tiredEndOfDay, stress, hardToRelax, enjoyableJob) {
  this.age = age;
  this.ageGroup = ageGroup;
  this.bmi = bmi;
  this.alcohol = alcohol;
  this.sickdays = sickdays;
  this.disabilityRisk = disabilityRisk;
  this.exercise = exercise;
  this.somber = somber;
  this.smoking = smoking;
  this.tiredEndOfDay = tiredEndOfDay;
  this.stress = stress;
  this.hardToRelax = hardToRelax;
  this.enjoyableJob = enjoyableJob;
}

fs.createReadStream('./src/server/data.csv')
  .pipe(csv({
    separator: ';',
  }))
  .on('data', (d) => {
    if (d.NoshowVsShow == 'Nee') {
      // console.log(d);
      dataSet.push(new Row(d.AGE_NAME, d.AgeCategoryNameLev1, d.BMI, d.Alkohol, d.VerzuimLev1Name, d.Arbeidsongeschiktheidsrisico, d.Bewegingsnorm, d.Somber_en_neerslachtig, d.Roken_op_dim_moment, d.Op_eind_van_de_dag, d.Vaak_last_van_stress, d.Moeilijk_ontspannen_eind_van_de_dag, d.Plezier_in_het_werk));
    }
  })
  .on('end', () => {
    console.log(dataSet.length);
  });

let router = express.Router();

app.use('/api', router);

router.use('/', function (req, res, next) {
  console.log({'url': `${req.originalUrl}`});
  next();
});

router.get('/averages', (req, res) => {
  res.json({
    sickdays: dataSet.filter(v => v.sickdays == "25 - 99 dagen").length / dataSet.filter(v => v.sickdays !== "").length * 100,
    somber: dataSet.filter(v => v.somber == "Ja").length / dataSet.filter(v => v.somber !== "").length * 100,
    tiredEndOfDay: dataSet.filter(v => v.tiredEndOfDay == "Ja").length / dataSet.filter(v => v.tiredEndOfDay !== "").length * 100,
    stress: dataSet.filter(v => v.stress == "Ja").length / dataSet.filter(v => v.stress !== "").length * 100,
    hardToRelax: dataSet.filter(v => v.hardToRelax == "Ja").length / dataSet.filter(v => v.hardToRelax !== "").length * 100,
    enjoyableJob: dataSet.filter(v => v.enjoyableJob == "Ja").length / dataSet.filter(v => v.enjoyableJob !== "").length * 100
  });
});

router.get('/theme/:theme([a-z]+)', (req, res) => {

  console.log("Handling Request for " + req.params.theme);
  let data = d3.nest()
    .key((d) => d[req.params.theme])
    .key((d) => d.age)
    .entries(dataSet.filter(d => (d[req.params.theme] !== '') && (d.age !== '') && (d.age <= 65)).sort(byAge));

  for (let i = 16; i <= 65; i++) {
    let sum = 0;
    for (let j = 0; j < data.length; j++) { // calculate sum of people over all groups
      let filtered = data[j].values.filter((age) => age.key == i.toString());
      if (filtered.length > 0) {
        sum += filtered[0].values.length;
      } else {
        console.log("No result for age " + i.toString())
      }
    }
    for (let k = 0; k < data.length; k++) {
      let filtered = data[k].values.filter((value) => value.key == i.toString());
      if (filtered.length > 0) {
        filtered[0].percentage = (filtered[0].values.length / sum) * 100;
      }
    }
  }

  res.json(data);
});

router.get('/mental/:theme([a-z]+)', (req, res) => {
  console.log("Handling Request for " + req.params.theme);
  let data = d3.nest()
    .key((d) => d[req.params.theme])
    .rollup(function (values) {
      return ({
        sickdays: values.filter(v => v.sickdays == "25 - 99 dagen").length / values.filter(v => v.sickdays !== "").length * 100,
        somber: values.filter(v => v.somber == "Ja").length / values.filter(v => v.sickdays !== "").length * 100,
        tiredEndOfDay: values.filter(v => v.tiredEndOfDay == "Ja").length / values.filter(v => v.sickdays !== "").length * 100,
        stress: values.filter(v => v.stress == "Ja").length / values.filter(v => v.sickdays !== "").length * 100,
        hardToRelax: values.filter(v => v.hardToRelax == "Ja").length / values.filter(v => v.sickdays !== "").length * 100

      })
    })
    .entries(dataSet.filter(d => (d[req.params.theme] !== '') && (d.sickdays !== '')));

  res.json(data);
});

function byAge(a, b) {
  if (a.age < b.age)
    return -1;
  if (a.age > b.age)
    return 1;
  return 0;
}

app.listen(8080, () => console.log('Listening on port 8080!'));