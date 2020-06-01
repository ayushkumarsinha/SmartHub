﻿using System.Text;

namespace PluginBase.Interfaces
{
    public interface IBuild<T> : IPlugin  where T : IBuild<T>
    {
        T Instantiate() ;
        string Build();
    }
}