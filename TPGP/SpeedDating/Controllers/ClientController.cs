using SpeedDating.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpeedDating.Controllers
{
    public class ClientController : Controller
    {
        private bdd baseDonnees = new bdd();
        //
        // GET: /Client/
        public ActionResult Utilisateurs()
        {
            return View(baseDonnees);
        }

        public ActionResult Inscription()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Inscription([Bind(Exclude = "Id,age,Ville,Descriptif")]User u)
        {
            //Si le formulaire est correctement rempli on redirige vers l'accueil
            if (ModelState.IsValid)
            {
                Console.WriteLine(u.Nom);
                baseDonnees.User.Add(u); 
                baseDonnees.SaveChanges();
        
                //baseDonnees.blog
                return RedirectToAction("Index", "Home");
            }

            //Sinon on le réaffiche
            return View();
        }
       
        public ActionResult Connexion()
        {
            return View();
        }
	}
}