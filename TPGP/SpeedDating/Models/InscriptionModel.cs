using System.ComponentModel.DataAnnotations;
  
namespace SpeedDating.Models
{
    public class InscriptionModel
    {
        [Required(ErrorMessage = "Le nom est obligatoire")]
        public string Nom { get; set; }
        [Required(ErrorMessage = "Le prénom est obligatoire")]
        public string Prenom { get; set; }
        [Required(ErrorMessage = "L'adresse mail est obligatoire")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Le mot de passe est obligatoire")]
        public string MDP { get; set; }
    }
}