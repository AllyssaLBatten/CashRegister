﻿namespace CashRegister.Core.Denominations
{
    /// <summary>
    /// Represents a penny denomination
    /// </summary>
    public class Penny : Denomination
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public Penny() : base("penny", 0.01) { }
    }
}
