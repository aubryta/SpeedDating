using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SpeedDating.Startup))]
namespace SpeedDating
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
