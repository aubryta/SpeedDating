using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using TPGP.Models;

namespace TPGP.Controllers
{
    [Authorize]
    public class UtilisateurController : Controller
    {
        private BDDEntities db = new BDDEntities();

        // GET: /Utilisateur/
        public ActionResult Index()
        {
            String id = User.Identity.Name;
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UtilisateursInformations utilisateursinformations = db.UtilisateursInformations.Find(id);
            if (utilisateursinformations == null)
            {

                //Si il n'existe pas, on simule un profil vide
                UtilisateursInformations util = new UtilisateursInformations()
                {
                    Id = id,
                    Prenom = ""

                };
                if (ModelState.IsValid)
                {
                    return View(util);
                }
            }
            return View(utilisateursinformations);
        }

        // GET: /Utilisateur/Details/5
        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UtilisateursInformations utilisateursinformations = db.UtilisateursInformations.Find(id);
            if (utilisateursinformations == null)
            {
                return HttpNotFound();
            }
            return View(utilisateursinformations);
        }

        // GET: /Utilisateur/Create
        public ActionResult Create()
        {
            //Si on ne trouve pas l'utilisateur dans la base, il n'a pas été créé
            //on affiche le profil
            if(db.UtilisateursInformations.Find(User.Identity.Name) == null)
                return View();

            //Sinon on affiche le profil
            return RedirectToAction("Index");
        }

        // POST: /Utilisateur/Create
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include="Prenom,Nom,Ville,Mail,Descriptif,Age,Sexe,InteressePar")] UtilisateursInformations utilisateursinformations)
        {
            //Si l'utilisateur est déjà créé, on le redirige vers son profil
            if (db.UtilisateursInformations.Find(User.Identity.Name) != null)
                return RedirectToAction("Index");

            //Sinon si c'est valide, on ajoute l'utilisateur à la base avec pour id le pseudo de connexion
            if (ModelState.IsValid)
            {
                utilisateursinformations.Id = User.Identity.Name;
                db.UtilisateursInformations.Add(utilisateursinformations);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(utilisateursinformations);
        }

        // GET: /Utilisateur/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UtilisateursInformations utilisateursinformations = db.UtilisateursInformations.Find(id);
            if (utilisateursinformations == null)
            {
                return HttpNotFound();
            }
            return View(utilisateursinformations);
        }

        // POST: /Utilisateur/Edit/5
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="Prenom,Nom,Ville,Mail,Descriptif,Age,Sexe,InteressePar")] UtilisateursInformations utilisateursinformations)
        {
            if (ModelState.IsValid)
            {
                db.Entry(utilisateursinformations).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(utilisateursinformations);
        }

        // GET: /Utilisateur/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UtilisateursInformations utilisateursinformations = db.UtilisateursInformations.Find(id);
            if (utilisateursinformations == null)
            {
                return HttpNotFound();
            }
            return View(utilisateursinformations);
        }

        // POST: /Utilisateur/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            UtilisateursInformations utilisateursinformations = db.UtilisateursInformations.Find(id);
            db.UtilisateursInformations.Remove(utilisateursinformations);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
