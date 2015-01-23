using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using TPGP.Models;

namespace TPGP.Controllers
{
    [Authorize]
    public class EvenementsController : Controller
    {
        private evtEntitities db = new evtEntitities();

        // GET: /Evenements/
        public ActionResult Index()
        {
            return View(db.Evenements.ToList());
        }
        
        // GET: /Evenements/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Evenements evenements = db.Evenements.Find(id);
            if (evenements == null)
            {
                return HttpNotFound();
            }
            return View(evenements);
        }

        // GET: /Evenements/Create
        [Authorize(Roles = "Admin, Createur")]
        public ActionResult Create()
        {
            return View();
        }

        // POST: /Evenements/Create
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin, Createur")]
        public ActionResult Create([Bind(Exclude="Createur")] Evenements evenements)
        {
            if (ModelState.IsValid)
            {
                db.Evenements.Add(new Evenements()
                {
                    Adresse = evenements.Adresse,
                    CodePostale = evenements.CodePostale,
                    Ville = evenements.Ville,
                    Nom = evenements.Nom,
                    Date = evenements.Date,
                    Descriptif = evenements.Descriptif,
                    Createur = User.Identity.Name
                });
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(evenements);
        }

        // GET: /Evenements/Edit/5
        [Authorize(Roles = "Admin, Createur")]
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Evenements evenements = db.Evenements.Find(id);
            if (evenements == null)
            {
                return HttpNotFound();
            }
            return View(evenements);
        }

        // POST: /Evenements/Edit/5
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin, Createur")]
        public ActionResult Edit([Bind(Include="Nom,Adresse,Ville,CodePostale,Date,Descriptif")] Evenements evenements)
        {
            if (ModelState.IsValid)
            {
                db.Entry(evenements).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(evenements);
        }

        // GET: /Evenements/Delete/5
        [Authorize(Roles = "Admin, Createur")]
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Evenements evenements = db.Evenements.Find(id);
            if (evenements == null)
            {
                return HttpNotFound();
            }
            return View(evenements);
        }

        // POST: /Evenements/Delete/5
        [Authorize(Roles = "Admin, Createur")]
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Evenements evenements = db.Evenements.Find(id);
            db.Evenements.Remove(evenements);
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
