using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TPGP.Startup))]
namespace TPGP
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
