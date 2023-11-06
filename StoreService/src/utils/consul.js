import Consul from "consul";

const consulClient = new Consul({
  host: process.env.CONSUL_HOST || "localhost",
  port: process.env.CONSUL_PORT || "8500",
});

export async function getURL(serviceName){
  try{
    const services = await consulClient.catalog.service.nodes(serviceName);
    return services[0].ServiceAddress + ":" + services[0].ServicePort
  }
  catch(err){
    console.log(err)
    return ''
  }
}
