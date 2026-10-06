# FACTS — Engineering Mechanics & Systems (620)
# Canonical Progen dialect facts grounded in TEXTBOOK.md and LINK_INDEX.md.

static mechanical equilibrium : state where vector sum of all external forces equals zero and sum of all external moments about any point equals zero. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 2.1

free body diagram = graphical representation isolating a structural component showing all applied forces, reaction forces, and moments acting upon it. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 2.2

method of joints in trusses : analytical procedure solving axial forces in pinned truss members by satisfying static concurrent force equilibrium at each joint. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 2.3

hooke law for linear elasticity : normal stress sigma is directly proportional to normal strain epsilon - sigma equals Young modulus E times epsilon. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 3.1

poisson ratio = dimensionless ratio of transverse contraction strain to longitudinal extension strain under axial mechanical loading. // door https://ocw.mit.edu/courses/materials-science-and-engineering/ // ref chapter 3.1

factor of safety = structural design ratio dividing material ultimate or yield strength by maximum allowable working stress. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 3.2

mohr circle for stress : graphical 2D coordinate transformation mapping normal and shear stress components to determine principal stresses and maximum shear. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 3.3

beam bending stress formula : flexural normal stress sigma equals internal bending moment M times distance from neutral axis y divided by second moment of area I. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 3.4

ohm law for electric circuits : voltage V across ideal conductor equals electric current I times resistance R - V equals I times R. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 4.1

kirchhoff current law : conservation of charge principle stating sum of electrical currents entering any circuit node identically equals sum leaving node. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 4.2

kirchhoff voltage law : conservation of energy principle stating directed sum of electrical potential differences around any closed circuit loop is zero. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 4.2

thevenin equivalent circuit : circuit theorem stating any linear two-terminal electrical network can be replaced by equivalent voltage source V_th in series with resistance R_th. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 4.3

involute gear profile = gear tooth curve ensuring conjugate action maintaining constant angular velocity ratio throughout tooth meshing engagement. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 5.1

bernoulli principle : in steady inviscid fluid flow along a streamline, static pressure plus dynamic pressure plus hydrostatic pressure remains constant. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 6.1

reynolds number = dimensionless ratio of inertial fluid forces to viscous forces characterizing transition between laminar and turbulent flow. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 6.2

fourier law of heat conduction : heat transfer rate q per unit area is proportional to negative temperature gradient - q equals negative thermal conductivity k times dT/dx. // door https://ocw.mit.edu/courses/mechanical-engineering/ // ref chapter 6.3

closed loop feedback control = control architecture comparing measured process variable to setpoint to compute corrective controller output minimizing error. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 7.1

pid controller terms : three-term control algorithm applying corrective output proportional to error, accumulated integral of error, and derivative rate of error. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 7.2

nyquist shannon sampling theorem : continuous signal can be completely reconstructed if discrete sampling frequency is strictly greater than twice highest signal frequency. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 8.1

free-body diagram : The isolated mechanical body with all applied external forces, gravitational body forces, and reaction forces/moments at the boundaries explicitly drawn. // door https://physics.nist.gov/ // ref 2.1 the equations of equilibrium

roller support : 1 reaction force normal to the surface Ry. // door https://physics.nist.gov/ // ref 2.1 the equations of equilibrium

pinned joint : 2 orthogonal reaction forces Rx, Ry. // door https://physics.nist.gov/ // ref 2.1 the equations of equilibrium

fixed / built-in support : 2 reaction forces plus 1 restraining moment Rx, Ry, Mz. // door https://physics.nist.gov/ // ref 2.1 the equations of equilibrium

method of joints : Isolate individual pin joints \sum Fx = 0, \sum Fy = 0. Ideal for finding forces in all members. // door https://physics.nist.gov/ // ref 2.2 planar trusses & frames

method of sections : Cut through a maximum of three unknown members and apply full equilibrium \sum Fx = 0, \sum Fy = 0, \sum M = 0. Ideal for finding internal loads in specific interior members. // door https://physics.nist.gov/ // ref 2.2 planar trusses & frames

gear velocity ratio : \frac{\omega1}{\omega2} = \frac{N2}{N1} = \frac{d2}{d1} = \frac{T2}{T1 \cdot \eta}. // door https://physics.nist.gov/ // ref 5.1 fundamental gear geometry formulas

feature control frame : [ Feature Symbol | Tolerance Value e.g. ⌀0.05 | Material Condition MMC/LMC | Datum A | Datum B | Datum C ]. // door https://physics.nist.gov/ // ref 6.4 geometric dimensioning & tolerancing gd&t / asme y14.5

key characteristics : True Position locational boundary, Flatness form, Perpendicularity orientation, Total Runout circularity + coaxiality under rotation. // door https://physics.nist.gov/ // ref 6.4 geometric dimensioning & tolerancing gd&t / asme y14.5

annealing / normalizing : Slow furnace cooling to produce soft, ductile, equilibrium Pearlite + Ferrite for optimal machinability. // door https://physics.nist.gov/ // ref 7.2 steel heat treatment & microstructures

real / active power : P = |V| |I| \cos\phi \quad [Watts, W] Performs physical work/heat. // door https://physics.nist.gov/ // ref 11.2 the ac power triangle

reactive power : Q = |V| |I| \sin\phi \quad [Volt-Amps Reactive, VAR] Sustains magnetic/electric fields. // door https://physics.nist.gov/ // ref 11.2 the ac power triangle

apparent power : S = |S| = \sqrt{P^2 + Q^2} \quad [Volt-Amps, VA]. // door https://physics.nist.gov/ // ref 11.2 the ac power triangle

power factor : PF = \cos\phi = \frac{P}{S} \quad Lagging for inductive loads, Leading for capacitive. // door https://physics.nist.gov/ // ref 11.2 the ac power triangle

zero input current : I+ = I- = 0 Infinite input impedance R{in} \to \infty. // door https://physics.nist.gov/ // ref 12.1 operational amplifiers op-amps

virtual short : V+ = V- Infinite open-loop gain A{OL} \to \infty. // door https://physics.nist.gov/ // ref 12.1 operational amplifiers op-amps

stability criterion : All roots of the characteristic equation 1 + Cs Gs Hs = 0 must lie strictly in the Open Left-Half of the Complex s-Plane Resi < 0. // door https://physics.nist.gov/ // ref 14.1 closed-loop transfer function

integral anti-windup : Disabling or clamping the integral accumulator when the actuator reaches physical saturation limits to prevent severe overshoot recovery delays. // door https://physics.nist.gov/ // ref 14.2 the pid controller
