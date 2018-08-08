using System;
using System.Diagnostics;
using System.Reflection;
using System.Web.Mvc;

namespace IAmGroot2.Extensions
{
    public static class HtmlExtensions
    {
        public static bool IsRelease(this HtmlHelper html)
        {
#if DEBUG
            return false;
#else
            return true;
#endif
        }

        public static string CurrentVersion(this HtmlHelper helper)
        {
            try
            {
                Assembly assembly = Assembly.GetExecutingAssembly();
                FileVersionInfo fvi = FileVersionInfo.GetVersionInfo(assembly.Location);
                return fvi.FileVersion;
            }
            catch (Exception ex)
            {
                throw new InvalidProgramException("Unable to load assembly or Unable to read assembly version from AssemblyInfo", ex);
            }
        }
    }
}