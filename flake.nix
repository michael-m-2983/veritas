{
  description = "Veritas";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        # Define Python packages we want
        # The 'ps' parameter is the Python package set
        pythonPackages = ps: with ps; [
          requests    # HTTP library
          pytest      # Testing framework
          black       # Code formatter
        ];
        
        # Create a Python environment with our packages
        pythonEnv = pkgs.python311.withPackages pythonPackages;
        
      in
      {
        # devShells.default is the development environment
        # It's activated with 'nix develop' or automatically via direnv
        # Documentation: https://nixos.wiki/wiki/Development_environment_with_nix-shell
        devShells.default = pkgs.mkShell {
          # Packages to include in the shell environment
          buildInputs = with pkgs; [
            # Python with our selected packages
            pythonEnv
            
            # Node.js (version 24)
            nodejs_24
          ];
        };
      });
}