﻿using System;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.Examples.Models;

namespace Kendo.Mvc.Examples.Controllers
{
    public partial class Radar_ChartsController : Controller
    {
        [Demo]
        public ActionResult Remote_Data_Binding()
        {
            return View();
        }

        [HttpPost]
        public ActionResult _BudgetReport()
        {
            return Json(ChartDataRepository.BudgetReport());
        }
    }
}