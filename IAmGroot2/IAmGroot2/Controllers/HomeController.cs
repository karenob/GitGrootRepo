using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace IAmGroot2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ServerRequest()
        {
            return View();
        }

        public ActionResult Approve(string taskToken)
        {
            ViewBag.TaskToken = taskToken;
            return View();
        }

        public ActionResult ListVM()
        {
            return View();
        }


        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }

    public class TestCommand
    {
        public string ServerType { get; set; }
        public string MemoryCpu { get; set; }
        public string Purpose { get; set; }
        public string Compliance { get; set; }
        public string Environment { get; set; }
        public string PrimaryDrive { get; set; }
        public string SecondaryDrive { get; set; }
        public string ServerOs { get; set; }
        public string Email { get; set; }
    }
}