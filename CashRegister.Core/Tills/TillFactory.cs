﻿using CashRegister.Interfaces.Banks;
using CashRegister.Interfaces.Tills;

namespace CashRegister.Core.Tills
{
    /// <summary>
    /// Abstract TillFactory
    /// </summary>
    public abstract class TillFactory
    {
        protected IBank bank;

        public TillFactory(IBank b)
        {
            bank = b;
        }

        public abstract ITill Create(bool randomize);
    }
}
