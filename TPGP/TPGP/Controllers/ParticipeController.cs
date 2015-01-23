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
    public class ParticipeController : Controller
    {
        private participeEntities db = new participeEntities();
        
        private BDDEntities utilDB = new BDDEntities();
        // GET: /Participe/
        public ActionResult Index()
        {
            return Redirect("/Evenements/");
        }

        // GET: /Participe/Details/5
        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            //On récupére tous les utilisateurs qui participe à cet évenements
            List<UtilisateursInformations> ulist = new List<UtilisateursInformations>();
            foreach(Participe p in db.Participe.ToList())
            {
                if(id.Equals(p.IdEvt))
                {
                    ulist.Add(utilDB.UtilisateursInformations.Find(p.IdUser));
                }
            }
            
            return View(ulist);
        }

        // GET: /Participe/Create
        public ActionResult Create()
        {
            //ON ne doit pas arriver ici
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }

        // POST: /Participe/Create
        [HttpPost]
        public ActionResult Create(string id)
        {

            Participe p = db.Participe.Find(id,User.Identity.Name );
            if(p != null)
            {
                return RedirectToAction("Details", new { id = id });
            }
            p = new Participe()
            {
                IdEvt = id,
                IdUser = User.Identity.Name
            };
            db.Participe.Add(p);
            db.SaveChanges();

            return RedirectToAction("Details", new { id = id });
        }

        // GET: /Participe/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Participe participe = db.Participe.Find(id);
            if (participe == null)
            {
                return HttpNotFound();
            }
            return View(participe);
        }

        // POST: /Participe/Edit/5
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="IdEvt,IdUser")] Participe participe)
        {
            if (ModelState.IsValid)
            {
                db.Entry(participe).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(participe);
        }

        // GET: /Participe/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Participe participe = db.Participe.Find(id,User.Identity.Name);
            if (participe == null)
            {
                return HttpNotFound();
            }
            return View(participe);
        }

        // POST: /Participe/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            Participe participe = db.Participe.Find(id, User.Identity.Name);
            db.Participe.Remove(participe);
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
